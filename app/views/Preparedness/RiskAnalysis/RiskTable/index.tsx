import {
    useCallback,
    useMemo,
} from 'react';
import { Table } from '@ifrc-go/ui';
import {
    createNumberColumn,
    createStringColumn,
    DEFAULT_INVALID_TEXT,
    minSafe,
    resolveToComponent,
} from '@ifrc-go/ui/utils';
import {
    _cs,
    isDefined,
    isNotDefined,
    listToMap,
    unique,
} from '@togglecorp/fujs';

import Link from '#components/Link';
import {
    CATEGORY_RISK_HIGH,
    CATEGORY_RISK_LOW,
    CATEGORY_RISK_MEDIUM,
    CATEGORY_RISK_VERY_HIGH,
    CATEGORY_RISK_VERY_LOW,
} from '#utils/constants';
import { type RiskApiResponse } from '#utils/restRequest';
import {
    getDataWithTruthyHazardType,
    getFiRiskDataItem,
    getValueForSelectedMonths,
    getWfRiskDataItem,
    hasSomeDefinedValue,
    riskScoreToCategory,
} from '#utils/risk';

import styles from './styles.module.css';

type CountryRiskResponse = RiskApiResponse<'/api/v1/country-seasonal/'>;
type RiskData = CountryRiskResponse[number];

interface Props {
    className?: string;
    riskData: RiskData | undefined;
    selectedMonths: Record<number, boolean> | undefined;
    dataPending: boolean;
}

function RiskTable(props: Props) {
    const {
        riskData,
        className,
        selectedMonths,
        dataPending,
    } = props;

    const fiData = useMemo(
        () => getFiRiskDataItem(riskData?.ipc_displacement_data),
        [riskData],
    );

    const wfData = useMemo(
        () => getWfRiskDataItem(riskData?.gwis),
        [riskData],
    );

    const hazardTypeList = useMemo(
        () => (
            unique(
                [
                    ...riskData?.idmc?.filter(hasSomeDefinedValue) ?? [],
                    ...riskData?.raster_displacement_data?.filter(hasSomeDefinedValue) ?? [],
                    ...riskData?.inform_seasonal?.filter(hasSomeDefinedValue) ?? [],
                    fiData,
                    wfData,
                ].filter(isDefined).map(getDataWithTruthyHazardType).filter(isDefined),
                (data) => data.hazard_type,
            ).map((combinedData) => ({
                hazard_type: combinedData.hazard_type,
                hazard_type_display: combinedData.hazard_type_display,
            }))
        ),
        [riskData, fiData, wfData],
    );

    type HazardTypeOption = (typeof hazardTypeList)[number];

    const hazardKeySelector = useCallback(
        (d: HazardTypeOption) => d.hazard_type,
        [],
    );

    const riskScoreToLabel = useCallback(
        (score: number | undefined | null, hazardType: HazardTypeOption['hazard_type']) => {
            if (isNotDefined(score) || score < 0) {
                return DEFAULT_INVALID_TEXT;
            }

            const riskCategory = riskScoreToCategory(score, hazardType);

            if (isNotDefined(riskCategory)) {
                return 'N/A';
            }

            const riskCategoryToLabelMap = {
                [CATEGORY_RISK_VERY_HIGH]: 'Very high',
                [CATEGORY_RISK_HIGH]: 'High',
                [CATEGORY_RISK_MEDIUM]: 'Medium',
                [CATEGORY_RISK_LOW]: 'Low',
                [CATEGORY_RISK_VERY_LOW]: 'Very low',
            };

            return riskCategoryToLabelMap[riskCategory];
        },
        [],
    );

    const displacementRiskData = useMemo(
        () => listToMap(
            riskData?.idmc?.map(getDataWithTruthyHazardType).filter(isDefined) ?? [],
            (data) => data.hazard_type,
        ),
        [riskData],
    );

    const exposureRiskData = useMemo(
        () => ({
            ...listToMap(
                riskData?.raster_displacement_data?.map(
                    getDataWithTruthyHazardType,
                ).filter(isDefined) ?? [],
                (data) => data.hazard_type,
            ),
            FI: fiData,
        }),
        [riskData, fiData],
    );

    const informSeasonalRiskData = useMemo(
        () => ({
            ...listToMap(
                riskData?.inform_seasonal?.map(getDataWithTruthyHazardType).filter(isDefined) ?? [],
                (data) => data.hazard_type,
            ),
            WF: wfData,
        }),
        [wfData, riskData],
    );

    const riskTableColumns = useMemo(
        () => ([
            createStringColumn<HazardTypeOption, string>(
                'hazard_type',
                'Hazard Type',
                (item) => item.hazard_type_display,
            ),
            createStringColumn<HazardTypeOption, string>(
                'riskScore',
                'Risk Score',
                (option) => riskScoreToLabel(
                    getValueForSelectedMonths(
                        selectedMonths,
                        informSeasonalRiskData[option.hazard_type],
                        'max',
                    ),
                    option.hazard_type,
                ),
                {
                    headerInfoTitle: 'Risk Score',
                    // FIXME: add description for wildfire
                    headerInfoDescription: (
                        <div className={styles.informDescription}>
                            <div>
                                These figures depict INFORM seasonal
                                hazard exposure values for each country
                                for each month on a five-point scale:
                            </div>
                            <div>
                                1: Very Low | 2: Low | 3: Medium | 4: High | 5: Very High.
                            </div>
                            <div>
                                {resolveToComponent(
                                    'More information on these values can be found {moreInfoLink}',
                                    {
                                        moreInfoLink: (
                                            <Link
                                                href="https://drmkc.jrc.ec.europa.eu/inform-index/INFORM-Covid-19/INFORM-Covid-19-Warning-beta-version"
                                                external
                                            >
                                                here
                                            </Link>
                                        ),
                                    },
                                )}
                            </div>
                        </div>
                    ),
                },
            ),
            createNumberColumn<HazardTypeOption, string>(
                'exposure',
                'People Exposed',
                (option) => getValueForSelectedMonths(
                    selectedMonths,
                    exposureRiskData[option.hazard_type],
                    option.hazard_type === 'FI' ? 'max' : 'sum',
                ),
                {
                    headerInfoTitle: 'People Exposed',
                    headerInfoDescription: 'These figures represent the number of people exposed to each hazard per month, on average. The population exposure figures are from the 2015 UNDRR Global Risk Model, based on average annual exposure to each hazard. The average annual exposure estimates were disaggregated by month based on recorded impacts of observed hazard events.',
                    maximumFractionDigits: 0,
                },
            ),
            createNumberColumn<HazardTypeOption, string>(
                'displacement',
                'People at Risk of Displacement',
                (option) => {
                    // NOTE: Naturally displacement should always be greater than
                    // or equal to the exposure. To follow that logic we reduce
                    // displacement value to show the exposure in case displacement
                    // is greater than exposure

                    const exposure = getValueForSelectedMonths(
                        selectedMonths,
                        exposureRiskData[option.hazard_type],
                    );

                    const displacement = getValueForSelectedMonths(
                        selectedMonths,
                        displacementRiskData[option.hazard_type],
                    );

                    if (isNotDefined(displacement)) {
                        return undefined;
                    }

                    return minSafe([exposure, displacement]);
                },
                {
                    headerInfoTitle: 'People at Risk of Displacement',
                    headerInfoDescription: "These figures represent the number of people expected to be displaced per month, on average, by each hazard. The estimates are based on the Internal Displacement Monitoring Centre's disaster displacement risk model using estimates for average annual displacement risk. These values were disaggregated by month based on historical displacement data associated with each hazard.",
                    maximumFractionDigits: 0,
                },
            ),
        ]),
        [
            displacementRiskData,
            exposureRiskData,
            informSeasonalRiskData,
            riskScoreToLabel,
            selectedMonths,
        ],
    );

    return (
        <Table
            filtered={false}
            pending={dataPending}
            className={_cs(styles.riskTable, className)}
            data={hazardTypeList}
            columns={riskTableColumns}
            keySelector={hazardKeySelector}
        />
    );
}

export default RiskTable;
