import { useState } from 'react';
import {
    Button,
    Container,
    DateInput,
    LegendItem,
    ListView,
    Pager,
    RadioInput,
    SelectInput,
    Table,
    TextOutput,
} from '@ifrc-go/ui';
import { SortContext } from '@ifrc-go/ui/contexts';
import {
    createDateColumn,
    createProgressColumn,
    createStringColumn,
    getPercentage,
    hasSomeDefinedValue,
    resolveToComponent,
    sumSafe,
} from '@ifrc-go/ui/utils';
import {
    isDefined,
    isNotDefined,
    listToGroupList,
    mapToMap,
    unique,
} from '@togglecorp/fujs';
import {
    MapBounds,
    MapLayer,
    MapSource,
} from '@togglecorp/re-map';
import { useRequest } from '@togglecorp/toggle-request';

import GlobalMap, { type AdminZeroFeatureProperties } from '#components/GlobalMap';
import GoMapContainer from '#components/GoMapContainer';
import Link from '#components/Link';
import MapPopup from '#components/MapPopup';
import useFilterState from '#hooks/useFilterState';
import useInputState from '#hooks/useInputState';
import {
    DEFAULT_MAP_PADDING,
    DURATION_MAP_ZOOM,
} from '#utils/constants';
import { getCountryListBoundingBox } from '#utils/map';
import {
    createAppealCodeColumn,
    createBudgetColumn,
    createDisasterTypeColumn,
    createEventColumn,
} from '#utils/tableHelpers';

import type {
    AppealListItem,
    AppealResponse,
    AppealTypeOption,
    ClickedPoint,
    CountryDataTypeResponse,
    EmergencyTypeListResponse,
} from './type';
import {
    APPEAL_TYPE_DREF,
    APPEAL_TYPE_EAP,
    APPEAL_TYPE_EMERGENCY,
    APPEAL_TYPE_MULTIPLE,
    appealKeySelector,
    appealTypeKeySelector,
    appealTypeLabelSelector,
    basePointLayerOptions,
    COLOR_DREF,
    COLOR_EAP,
    COLOR_EMERGENCY_APPEAL,
    COLOR_MULTIPLE_TYPES,
    optionKeySelector,
    optionLabelSelector,
    outerCircleLayerOptionsForFinancialRequirements,
    outerCircleLayerOptionsForPeopleTargeted,
    type ScaleOption,
} from './utils';

const sourceOptions: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};

const appealTypeOptions : AppealTypeOption[] = [
    {
        key: 0,
        value: 'DREF',
    },
    {
        key: 1,
        value: 'Emergency Appeal',
    },
    {
        key: 2,
        value: 'International Appeal',
    },
    {
        key: 3,
        value: 'Forecast Based Action',
    },
];

const now = new Date().toISOString();

const IfrcGoUrl = import.meta.env.APP_GO_URL;

const countryId = 65; // ethiopia

function ActiveOperation() {
    const [scaleBy, setScaleBy] = useInputState<ScaleOption['value']>('peopleTargeted');
    const [presentationMode, setPresentationMode] = useState(false);
    const {
        filter,
        filtered,
        limit,
        page,
        rawFilter,
        setFilter,
        setFilterField,
        setPage,
        sortState,
        offset,
    } = useFilterState<{
        appeal?: AppealTypeOption['key'],
        district?: number[],
        displacement?: number,
        startDateAfter?: string,
        startDateBefore?: string,
    }>({
        filter: {},
        pageSize: 5,
    });

    const isFiltered = hasSomeDefinedValue(rawFilter);
    const { response: countryData } = useRequest<CountryDataTypeResponse, unknown, unknown>(
        {
            url: '/api/v2/country/',
            method: 'GET',
            query: { id: countryId },
            pathVariables: {},
        },
    );

    const queryParams = {
        atype: filter.appeal,
        dtype: filter.displacement,
        district: hasSomeDefinedValue(filter.district) ? filter.district : undefined,
        end_date__gt: now,
        start_date__gte: filter.startDateAfter,
        start_date__lte: filter.startDateBefore,
        limit,
        offset,
        region: undefined,
        country: countryId,
    };
    const [
        clickedPoint,
        setClickedPoint,
    ] = useState<ClickedPoint| undefined>();

    const { response, pending, error } = useRequest<AppealResponse, unknown, unknown>(
        {
            url: '/api/v2/appeal/',
            method: 'GET',
            query: queryParams,
            skip: isNotDefined(countryData),
            pathVariables: {},
        },
    );

    const { response: disasterResponse } = useRequest<EmergencyTypeListResponse, unknown, unknown>(
        {
            url: '/api/v2/disaster_type/',
            method: 'GET',
            pathVariables: {},
        },
    );

    const countryGroupedAppeal = listToGroupList(
        response?.results ?? [],
        (appeal) => appeal.country.iso3 ?? '<no-key>',
    );

    const countryCentroidGeoJson = (): GeoJSON.FeatureCollection<GeoJSON.Geometry> => {
        const countryToOperationTypeMap = mapToMap(
            countryGroupedAppeal,
            (key) => key,
            (appealList) => {
                const uniqueAppealList = unique(
                    appealList.map((appeal) => appeal.atype),
                );

                const peopleTargeted = sumSafe(
                    appealList.map((appeal) => appeal.num_beneficiaries),
                );
                const financialRequirements = sumSafe(
                    appealList.map((appeal) => appeal.amount_requested),
                );

                if (uniqueAppealList.length > 1) {
                    return {
                        appealType: APPEAL_TYPE_MULTIPLE,
                        peopleTargeted,
                        financialRequirements,
                    };
                }

                return {
                    appealType: uniqueAppealList[0],
                    peopleTargeted,
                    financialRequirements,
                };
            },
        );

        const iso3 = countryData?.results[0].iso3;
        const operation = iso3 ? countryToOperationTypeMap[iso3] : undefined;

        return {
            type: 'FeatureCollection' as const,
            features: (countryData?.results[0] ? [countryData.results[0]] : [])
                ?.map((country) => {
                    if (
                        (!country.independent && isNotDefined(country.record_type))
                            || isNotDefined(country.centroid)
                            || isNotDefined(country.iso3)
                    ) {
                        return undefined;
                    }

                    if (isNotDefined(operation)) {
                        return undefined;
                    }

                    return {
                        type: 'Feature' as const,
                        geometry: country.centroid as {
                                type: 'Point',
                                coordinates: [number, number],
                            },
                        properties: {
                            id: country.iso3,
                            appealType: operation.appealType,
                            peopleTargeted: operation.peopleTargeted,
                            financialRequirements: operation.financialRequirements,
                        },
                    };
                }).filter(isDefined) ?? [],
        };
    };

    const scaleOptions: ScaleOption[] = ([
        { value: 'peopleTargeted', label: '# of people targeted' },
        { value: 'financialRequirements', label: 'IFRC financial requirements' },
    ]);

    const legendOptions = ([
        {
            value: APPEAL_TYPE_EMERGENCY,
            label: 'Emergency Appeal',
            color: COLOR_EMERGENCY_APPEAL,
        },
        {
            value: APPEAL_TYPE_DREF,
            label: 'DREF',
            color: COLOR_DREF,
        },
        {
            value: APPEAL_TYPE_EAP,
            label: 'Early Action Protocol Activation',
            color: COLOR_EAP,
        },
        {
            value: APPEAL_TYPE_MULTIPLE,
            label: 'Multiple Types',
            color: COLOR_MULTIPLE_TYPES,
        },
    ]);

    const bbox = getCountryListBoundingBox(countryData?.results ?? []);

    const heading = resolveToComponent(
        'Active Operations Map ({numAppeals})',
        { numAppeals: response?.count ?? 0 },
    );

    const popupDetails = clickedPoint
        ? countryGroupedAppeal[clickedPoint.featureProperties.iso3]
        : undefined;

    const handlePointClose = () => {
        setClickedPoint(undefined);
    };

    const handleCountryClick = (
        featureProperties: AdminZeroFeatureProperties,
        lngLat: mapboxgl.LngLatLike,
    ) => {
        setClickedPoint({
            featureProperties,
            lngLat,
        });

        return true;
    };

    const columns = [
        createDateColumn<AppealListItem, string>(
            'start_date',
            'Start Date',
            (item) => item.start_date,
            { sortable: true },
        ),
        createStringColumn<AppealListItem, string>(
            'atype',
            'Appeal Type',
            (item) => item.atype_display,
            { sortable: true },
        ),
        createAppealCodeColumn<AppealListItem, string>(
            'code',
            'Code',
            (item) => item.code,
        ),
        createEventColumn<AppealListItem, string>(
            'operation',
            'operation',
            (item) => item.name,
            (item) => ({
                href: `https://goadmin-stage.ifrc.org/emergencies/${item.event}/details`,
                external: true,
            }),
        ),
        createDisasterTypeColumn<AppealListItem, string>(
            'dtype',
            'Disater Type',
            (item) => item.dtype?.name,
            { sortable: true },
        ),
        createBudgetColumn<AppealListItem, string>(
            'amount_requested',
            'Amount Requested',
            (item) => item.amount_requested,
            { sortable: true },
        ),
        createProgressColumn<AppealListItem, string>(
            'amount_funded',
            'Amount funded',
            // FIXME: use progress function
            (item) => (
                getPercentage(
                    item.amount_funded,
                    item.amount_requested,
                )
            ),
            { sortable: true },
        ),
    ].filter(isDefined);

    const handleClearFiltersButtonClick = (() => {
        setFilter({});
    });

    const disasterTypes = disasterResponse?.results.map((disaster) => ({
        key: disaster.id,
        value: disaster.name,
    })) ?? [];

    return (
        <Container
            overlayPending
            heading={!presentationMode && heading}
            withHeaderBorder={!presentationMode}
            headerActions={!presentationMode && (
                <Link
                    href={`${IfrcGoUrl}/emergencies/all?country=${countryId}`}
                    withLinkIcon
                    withUnderline
                    external
                    spacing="4xs"
                >
                    View all Emergencies
                </Link>
            )}
            filters={(
                <>
                    <DateInput
                        name="startDateAfter"
                        label="Start After"
                        onChange={setFilterField}
                        value={rawFilter.startDateAfter}
                    />
                    <DateInput
                        name="startDateBefore"
                        label="Start Before"
                        onChange={setFilterField}
                        value={rawFilter.startDateBefore}
                    />
                    <SelectInput
                        placeholder="All Appeal Types"
                        label="Appeal"
                        name="appeal"
                        value={rawFilter.appeal}
                        onChange={setFilterField}
                        keySelector={appealTypeKeySelector}
                        labelSelector={appealTypeLabelSelector}
                        options={appealTypeOptions}
                    />
                    <SelectInput
                        placeholder="All Disaster Types"
                        label="Disaster Type"
                        name="displacement"
                        value={rawFilter.displacement}
                        onChange={setFilterField}
                        keySelector={appealTypeKeySelector}
                        labelSelector={appealTypeLabelSelector}
                        options={disasterTypes}
                    />
                    <Button
                        name={undefined}
                        onClick={handleClearFiltersButtonClick}
                        disabled={!filtered}
                    >
                        Clear
                    </Button>
                </>
            )}
            footerActions={(
                <Pager
                    activePage={page}
                    itemsCount={response?.count ?? 0}
                    maxItemsPerPage={limit}
                    onActivePageChange={setPage}
                />
            )}
        >
            <GlobalMap
                onAdminZeroFillClick={handleCountryClick}
            >
                <GoMapContainer
                    title="Global Emergency Map"
                    withPresentationMode
                    onPresentationModeChange={setPresentationMode}
                    footer={(
                        <>
                            <RadioInput
                                label="Scale points by"
                                name={undefined}
                                options={scaleOptions}
                                keySelector={optionKeySelector}
                                labelSelector={optionLabelSelector}
                                value={scaleBy}
                                onChange={setScaleBy}
                            />
                            <ListView
                                withWrap
                                withSpacingOpticalCorrection
                                spacing="sm"
                            >
                                {legendOptions.map((legendItem) => (
                                    <LegendItem
                                        key={legendItem.value}
                                        color={legendItem.color}
                                        label={legendItem.label}
                                    />
                                ))}
                            </ListView>
                        </>
                    )}
                />
                <MapSource
                    sourceKey="points"
                    sourceOptions={sourceOptions}
                    geoJson={countryCentroidGeoJson()}
                >
                    <MapLayer
                        layerKey="point-circle"
                        layerOptions={basePointLayerOptions}
                    />
                    <MapLayer
                        key={scaleBy}
                        layerKey="point-outer-circle"
                        layerOptions={
                            scaleBy === 'peopleTargeted'
                                ? outerCircleLayerOptionsForPeopleTargeted
                                : outerCircleLayerOptionsForFinancialRequirements
                        }
                    />
                </MapSource>
                {clickedPoint?.lngLat && (
                    <MapPopup
                        onCloseButtonClick={handlePointClose}
                        coordinates={clickedPoint.lngLat}
                        heading={clickedPoint.featureProperties.name}
                        withPadding
                        empty={isNotDefined(popupDetails) || popupDetails.length === 0}
                        emptyMessage="Details not available"
                    >
                        <ListView
                            layout="block"
                            spacing="sm"
                            withSpacingOpticalCorrection
                        >
                            {popupDetails?.map(
                                (appeal) => (
                                    <Container
                                        key={appeal.id}
                                        heading={appeal.name}
                                        headingLevel={6}
                                        spacing="xs"
                                    >
                                        <ListView
                                            layout="block"
                                            spacing="2xs"
                                            withSpacingOpticalCorrection
                                        >
                                            <TextOutput
                                                value={appeal.num_beneficiaries}
                                                description="People Targeted"
                                                valueType="number"
                                                textSize="sm"
                                            />
                                            <TextOutput
                                                value={appeal.amount_requested}
                                                description="Amount Requested (CHF)"
                                                valueType="number"
                                                textSize="sm"
                                            />
                                            <TextOutput
                                                value={appeal.amount_funded}
                                                description="Amount Funded (CHF)"
                                                valueType="number"
                                                textSize="sm"
                                            />
                                        </ListView>
                                    </Container>
                                ),
                            )}
                        </ListView>
                    </MapPopup>
                )}
                {isDefined(bbox) && (
                    <MapBounds
                        duration={DURATION_MAP_ZOOM}
                        bounds={bbox}
                        padding={DEFAULT_MAP_PADDING}
                    />
                )}
            </GlobalMap>
            <SortContext.Provider value={sortState}>
                <Table
                    pending={pending}
                    filtered={isFiltered}
                    columns={columns}
                    keySelector={appealKeySelector}
                    data={response?.results}
                    errored={isDefined(error)}
                />
            </SortContext.Provider>
        </Container>
    );
}

export default ActiveOperation;
