import {
    useCallback,
    useMemo,
} from 'react';
import {
    Container,
    DateOutput,
    Description,
    ListView,
    NumberOutput,
    TextOutput,
} from '@ifrc-go/ui';
import {
    resolveToComponent,
    resolveToString,
} from '@ifrc-go/ui/utils';
import {
    compareString,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';

import Link from '#components/Link';
import { type RiskApiResponse } from '#utils/restRequest';

type MeteoSwissResponse = RiskApiResponse<'/api/v1/meteoswiss/'>;
type MeteoSwissItem = NonNullable<MeteoSwissResponse['results']>[number];
// type MeteoSwissExposure = RiskApiResponse<'/api/v1/meteoswiss/{id}/exposure/'>;

const UPDATED_AT_FORMAT = 'yyyy-MM-dd, hh:mm';

interface Props {
    data: MeteoSwissItem;
    // exposure: MeteoSwissExposure | undefined;
    pending: boolean;
}
const SAFFIR_SIMPSON_SCALE = [
    { threshold: 33, description: 'equivalent to tropical storm or above' },
    { threshold: 43, description: 'equivalent to a category 1 hurricane or above' },
    { threshold: 50, description: 'equivalent to a category 2 hurricane or above' },
    { threshold: 59, description: 'equivalent to a category 3 hurricane or above' },
    { threshold: 71, description: 'equivalent to a category 4 hurricane or above' },
];

const CATEGORY_5_DESCRIPTION = 'equivalent to a category 5 hurricane or above';
function EventDetails(props: Props) {
    const {
        data: {
            country_details,
            start_date,
            updated_at,
            hazard_name,
            model_name,
            event_details,
        },
        pending,
    } = props;

    const getSaffirSimpsonScaleDescription = useCallback((windspeed: number) => (
        SAFFIR_SIMPSON_SCALE.find(({ threshold }) => windspeed < threshold)?.description
        ?? CATEGORY_5_DESCRIPTION
    ), []);

    const impactList = useMemo(
        () => (
            // FIXME: typings should be fixed in the server
            (event_details as unknown as unknown[])?.map((event: unknown, i: number) => {
                if (
                    typeof event !== 'object'
                    || isNotDefined(event)
                    || !('mean' in event)
                    || !('impact_type' in event)
                    || !('five_perc' in event)
                    || !('ninety_five_perc' in event)
                ) {
                    return undefined;
                }

                const {
                    impact_type,
                    five_perc,
                    ninety_five_perc,
                    mean,
                } = event;

                const valueSafe = typeof mean === 'number' ? Math.round(mean) : undefined;
                const fivePercentValue = typeof five_perc === 'number' ? Math.round(five_perc) : undefined;
                const ninetyFivePercentValue = typeof ninety_five_perc === 'number' ? Math.round(ninety_five_perc) : undefined;
                if (isNotDefined(valueSafe) || valueSafe === 0) {
                    return undefined;
                }

                if (typeof impact_type !== 'string') {
                    return undefined;
                }

                if (impact_type === 'direct_economic_damage') {
                    return {
                        key: i,
                        type: 'economic',
                        value: valueSafe,
                        fivePercentValue,
                        ninetyFivePercentValue,
                        label: 'Wind related direct economic damage',
                        unit: 'USD',
                    };
                }

                if (impact_type.startsWith('exposed_population_')) {
                    const windspeed = Number.parseInt(
                        impact_type.split('exposed_population_')[1]!,
                        10,
                    );

                    if (isNotDefined(windspeed)) {
                        return undefined;
                    }

                    return {
                        key: i,
                        type: 'exposure',
                        value: valueSafe,
                        fivePercentValue,
                        ninetyFivePercentValue,
                        label: resolveToString(
                            'Estimated people exposed to windspeed above {windspeed}m/s. ({saffirSimpsonScale})',
                            {
                                windspeed,
                                saffirSimpsonScale: getSaffirSimpsonScaleDescription(windspeed),
                            },
                        ),
                        unit: 'People',
                    };
                }

                return undefined;
            }).filter(isDefined).sort((a, b) => compareString(b.type, a.type))
        ),
        [
            event_details,
            getSaffirSimpsonScaleDescription,
        ],
    );

    // TODO: add exposure details
    return (
        <Container
            pending={pending}
        >
            <Container
                heading="Impact in all affected countries"
                headingLevel={5}
                withHeaderBorder
            >
                <ListView layout="block">
                    {impactList.map((impact) => (
                        <TextOutput
                            key={impact.key}
                            label={resolveToComponent(
                                '{label} {beta}',
                                {
                                    label: impact.label,
                                    beta: <span>beta</span>,
                                },
                            )}
                            value={resolveToComponent(
                                '{value} ({fivePercent} - {ninetyFivePercent}) {unit}',
                                {
                                    value: (
                                        <NumberOutput
                                            value={impact.value}
                                            compact
                                            maximumFractionDigits={2}
                                        />
                                    ),
                                    fivePercent: (
                                        <NumberOutput
                                            value={impact.fivePercentValue}
                                            compact
                                            maximumFractionDigits={2}
                                        />
                                    ),
                                    ninetyFivePercent: (
                                        <NumberOutput
                                            value={impact.ninetyFivePercentValue}
                                            compact
                                            maximumFractionDigits={2}
                                        />
                                    ),
                                    unit: impact.unit,
                                },
                            )}
                            strongValue
                        />
                    ))}
                    <Description>
                        These impact estimates are derived from
                        a model and come with very high uncertainty.
                        More information will be added soon.
                    </Description>
                </ListView>
            </Container>
            <div>
                {resolveToComponent(
                    '{model} has forecasted a tropical cyclone on {updatedAt}. The tropical cyclone named {eventName} is forecasted to impact {countryName} from {eventDate}.',
                    {
                        model: model_name ?? '--',
                        updatedAt: (
                            <DateOutput
                                value={updated_at}
                                format={UPDATED_AT_FORMAT}
                            />
                        ),
                        eventName: hazard_name,
                        countryName: country_details?.name ?? '--',
                        eventDate: <DateOutput value={start_date} />,
                    },
                )}
            </div>
            <div>
                {resolveToComponent(
                    'Please also consider {link} and classification of {classificationLink}.',
                    {
                        link: (
                            <Link
                                href="https://severeweather.wmo.int"
                                external
                            >
                                authoritative information about the hazard
                            </Link>
                        ),
                        classificationLink: (
                            <Link
                                href="https://community.wmo.int/en/classification-tropical-cyclones"
                                external
                            >
                                tropical storm
                            </Link>
                        ),
                    },
                )}
            </div>
        </Container>
    );
}

export default EventDetails;
