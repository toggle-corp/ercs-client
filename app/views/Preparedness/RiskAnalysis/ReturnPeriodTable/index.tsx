import { useMemo } from 'react';
import {
    Container,
    SelectInput,
    Table,
    TextOutput,
} from '@ifrc-go/ui';
import {
    createNumberColumn,
    createStringColumn,
    resolveToComponent,
} from '@ifrc-go/ui/utils';
import {
    isDefined,
    isFalsyString,
    unique,
} from '@togglecorp/fujs';

import Link from '#components/Link';
import type {
    components,
    paths,
} from '#generated/riskTypes';
import useInputState from '#hooks/useInputState';

type GetCountryRisk = paths['/api/v1/country-seasonal/']['get'];
type CountryRiskResponse = GetCountryRisk['responses']['200']['content']['application/json'];
type HazardType = components['schemas']['CommonHazardTypeEnumKey'];
interface HazardTypeOption {
    hazard_type: HazardType;
    hazard_type_display: string;
}
interface TransformedReturnPeriodData {
    frequencyDisplay: string;
    displacement: number | undefined;
    exposure: number | undefined;
    economicLosses: number | undefined;
}

function hazardTypeKeySelector(option: HazardTypeOption) {
    return option.hazard_type;
}
function hazardTypeLabelSelector(option: HazardTypeOption) {
    return option.hazard_type_display;
}
function returnPeriodKeySelector(option: TransformedReturnPeriodData) {
    return option.frequencyDisplay;
}

interface Props {
    data: CountryRiskResponse[number]['return_period_data'] | undefined;
}

function ReturnPeriodTable(props: Props) {
    const { data } = props;
    const [hazardType, setHazardType] = useInputState<HazardType>('FL');
    const hazardOptions = useMemo(
        () => (
            unique(
                data?.map(
                    (datum) => {
                        // FIXME: Update isFalsyString to Exclude empty string
                        // FIXME: Also fix this in server
                        if (isFalsyString(datum.hazard_type)) {
                            return undefined;
                        }

                        return {
                            hazard_type: datum.hazard_type,
                            hazard_type_display: datum.hazard_type_display,
                        };
                    },
                ).filter(isDefined) ?? [],
                (datum) => datum.hazard_type_display,
            )
        ),
        [data],
    );

    const columns = [
        createStringColumn<TransformedReturnPeriodData, string | number>(
            'frequency',
            'Return Period / Expected Frequency',
            (item) => item.frequencyDisplay,
        ),
        createNumberColumn<TransformedReturnPeriodData, string | number>(
            'numRiskOfDisplacement',
            'People at Risk of Displacement',
            (item) => item.displacement,
            {
                headerInfoTitle: 'People at Risk of Displacement',
                headerInfoDescription: resolveToComponent(
                    'Figures provided by IDMC from its {source}',
                    {
                        source: (
                            <Link
                                href="https://www.internal-displacement.org/database/global-displacement-risk-model"
                                external
                            >
                                Disaster Displacement Risk Model
                            </Link>
                        ),
                    },
                ),
                maximumFractionDigits: 0,
            },
        ),
        createNumberColumn<TransformedReturnPeriodData, string | number>(
            'economicLosses',
            'Economic Losses (USD)',
            (item) => item.economicLosses,
            {
                headerInfoTitle: 'Economic Losses (USD)',
                headerInfoDescription: resolveToComponent(
                    'Figures taken from {source}',
                    {
                        source: (
                            <Link
                                href="https://www.gfdrr.org/en/disaster-risk-country-profiles"
                                external
                            >
                                World Bank Disaster Risk Country Profiles
                            </Link>
                        ),
                    },
                ),
            },
        ),
    ];

    const transformedReturnPeriods = useMemo<TransformedReturnPeriodData[]>(
        () => {
            const value = data?.find(
                (d) => d.hazard_type === hazardType,
            );

            return [
                {
                    frequencyDisplay: '1-in-20-year event',
                    displacement: value?.twenty_years?.population_displacement,
                    economicLosses: value?.twenty_years?.economic_loss,
                    exposure: value?.twenty_years?.economic_loss,
                },
                {
                    frequencyDisplay: '1-in-50-year event',
                    displacement: value?.fifty_years?.population_displacement,
                    economicLosses: value?.fifty_years?.economic_loss,
                    exposure: value?.fifty_years?.population_exposure,
                },
                {
                    frequencyDisplay: '1-in-100-year event',
                    displacement: value?.hundred_years?.population_displacement,
                    economicLosses: value?.hundred_years?.economic_loss,
                    exposure: value?.hundred_years?.population_exposure,
                },
                {
                    frequencyDisplay: '1-in-250-year event',
                    displacement: value?.two_hundred_fifty_years?.population_displacement,
                    economicLosses: value?.two_hundred_fifty_years?.economic_loss,
                    exposure: value?.two_hundred_fifty_years?.population_exposure,
                },
                {
                    frequencyDisplay: '1-in-500-year event',
                    displacement: value?.five_hundred_years?.population_displacement,
                    economicLosses: value?.five_hundred_years?.economic_loss,
                    exposure: value?.five_hundred_years?.population_exposure,
                },
            ];
        },
        [data, hazardType],
    );

    return (
        <Container
            heading="Expected Return Periods"
            withHeaderBorder
            footerActions={(
                <TextOutput
                    label="Source"
                    value="UNDRR, World Bank / GFDRR and IDMC"
                    strongValue
                />
            )}
            filters={(
                <SelectInput
                    name={undefined}
                    options={hazardOptions}
                    keySelector={hazardTypeKeySelector}
                    labelSelector={hazardTypeLabelSelector}
                    value={hazardType}
                    onChange={setHazardType}
                    nonClearable
                />
            )}
        >
            <Table
                filtered={false}
                pending={false}
                data={transformedReturnPeriods}
                columns={columns}
                keySelector={returnPeriodKeySelector}
            />
        </Container>
    );
}

export default ReturnPeriodTable;
