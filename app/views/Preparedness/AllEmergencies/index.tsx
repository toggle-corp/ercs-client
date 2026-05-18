import { useMemo } from 'react';
import {
    Container,
    DateInput,
    Description,
    NumberOutput,
    Pager,
    Table,
} from '@ifrc-go/ui';
import { SortContext } from '@ifrc-go/ui/contexts';
import {
    createDateColumn,
    createNumberColumn,
    createStringColumn,
    resolveToComponent,
    sumSafe,
} from '@ifrc-go/ui/utils';
import {
    isDefined,
    max,
} from '@togglecorp/fujs';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

import DisasterTypeSelectInput from '#components/DisasterTypeSelectInput';
import ExportButton from '#components/ExportButton';
import { goUrl } from '#config';
import useAlert from '#hooks/useAlert';
import useFilterState from '#hooks/useFilterState';
import useRecursiveCSVRequest from '#hooks/useRecursiveCsvRequest';
import useUrlSearchState from '#hooks/useUrlSearchState';
import {
    type GoApiResponse,
    type GoApiUrlQuery,
    useRequest,
} from '#utils/restRequest';
import { createLinkColumn } from '#utils/tableHelpers';

import styles from './styles.module.css';

type EventResponse = GoApiResponse<'/api/v2/event/'>;
type EventQueryParams = GoApiUrlQuery<'/api/v2/event/'>;
type EventListItem = NonNullable<EventResponse['results']>[number];

function getMostRecentAffectedValue(fieldReport: EventListItem['field_reports']) {
    const latestReport = max(fieldReport, (item) => new Date(item.updated_at).getTime());
    return latestReport?.num_affected;
}

const eventKeySelector = (item: EventListItem) => item.id;

function AllEmergency() {
    const {
        sortState,
        ordering,
        page,
        setPage,
        limit,
        offset,
        rawFilter,
        filter,
        setFilterField,
        filtered,
    } = useFilterState<{
        startDateAfter?: string,
        startDateBefore?: string,
    }>({
        filter: {},
        pageSize: 10,
    });
    const alert = useAlert();

    const columns = [
        createDateColumn<EventListItem, number>(
            'disaster_start_date',
            'Start Date',
            (item) => item.disaster_start_date,
            {
                sortable: true,
                columnClassName: styles.createdAt,
            },
        ),
        createLinkColumn<EventListItem, number>(
            'event_name',
            'Name',
            (item) => item.name,
            (item) => ({
                href: `${goUrl}/emergencies/${item.id}/details`,
                external: true,
            }),
            { sortable: true },
        ),
        createStringColumn<EventListItem, number>(
            'dtype',
            'Disaster Type',
            (item) => item.dtype?.name,
        ),
        createStringColumn<EventListItem, number>(
            'glide',
            'Glide',
            (item) => item.glide,
            { sortable: true },
        ),
        createNumberColumn<EventListItem, number>(
            'amount_requested',
            'Requested Amount',
            (item) => sumSafe(
                item.appeals.map((appeal) => appeal.amount_requested),
            ),
            {
                suffix: ' CHF',
            },
        ),
        createNumberColumn<EventListItem, number>(
            'num_affected',
            '# Affected',
            (item) => item.num_affected ?? getMostRecentAffectedValue(item.field_reports),
            { sortable: true },
        ),
    ];

    const [filterDisasterType, setFilterDisasterType] = useUrlSearchState<number | undefined>(
        'dtype',
        (searchValue) => {
            const potentialValue = isDefined(searchValue) ? Number(searchValue) : undefined;
            return potentialValue;
        },
        (dtype) => (isDefined(dtype) ? String(dtype) : undefined),
    );

    const query = useMemo<EventQueryParams>(
        () => ({
            limit,
            offset,
            ordering,
            dtype: filterDisasterType,
            // FIXME: The server should actually accept array of number instead
            // of just number
            countries__in: 65,
            disaster_start_date__gte: filter.startDateAfter,
            disaster_start_date__lte: filter.startDateBefore,
        }),
        [
            limit,
            offset,
            ordering,
            filterDisasterType,
            filter,
        ],
    );

    const {
        pending: eventPending,
        response: eventResponse,
    } = useRequest({
        url: '/api/v2/event/',
        preserveResponse: true,
        query,
    });

    const heading = useMemo(
        () => resolveToComponent(
            'All Emergencies ({numEmergencies})',
            {
                numEmergencies: (
                    <NumberOutput
                        value={eventResponse?.count}
                    />
                ),
            },
        ),
        [eventResponse],
    );

    const [
        pendingExport,
        progress,
        triggerExportStart,
    ] = useRecursiveCSVRequest({
        onFailure: () => {
            alert.show(
                'Failed to generate export.',
                { variant: 'danger' },
            );
        },
        onSuccess: (data) => {
            const unparseData = Papa.unparse(data);
            const blob = new Blob(
                [unparseData],
                { type: 'text/csv' },
            );
            saveAs(blob, 'all-emergencies.csv');
        },
    });

    const handleExportClick = (() => {
        if (!eventResponse?.count) {
            return;
        }
        triggerExportStart(
            '/api/v2/event/',
            eventResponse?.count,
            query,
        );
    });

    const isFiltered = isDefined(filterDisasterType) || filtered;

    return (
        <Container
            className={styles.allEmergencies}
            heading={heading}
            headingLevel={2}
            headerDescription={(
                <Description withLightText>
                    Explore historical data, research findings and
                    operational reports to support informed decision-making and planning.
                </Description>
            )}
            headerActions={(
                <ExportButton
                    onClick={handleExportClick}
                    progress={progress}
                    pendingExport={pendingExport}
                    totalCount={eventResponse?.count}
                />
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
                    <DisasterTypeSelectInput
                        placeholder="All Disaster Types"
                        name="disaster-type"
                        label="Disaster Type"
                        value={filterDisasterType}
                        onChange={setFilterDisasterType}
                    />
                </>
            )}
            footerActions={(
                <Pager
                    activePage={page}
                    itemsCount={eventResponse?.count ?? 0}
                    maxItemsPerPage={limit}
                    onActivePageChange={setPage}
                />
            )}
        >
            <SortContext.Provider value={sortState}>
                <Table
                    pending={eventPending}
                    className={styles.table}
                    columns={columns}
                    keySelector={eventKeySelector}
                    data={eventResponse?.results}
                    filtered={isFiltered}
                />
            </SortContext.Provider>
        </Container>
    );
}

export default AllEmergency;
