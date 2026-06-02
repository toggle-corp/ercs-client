import {
    Container,
    InlineLayout,
    ListView,
    TextOutput,
} from '@ifrc-go/ui';
import { isDefined } from '@togglecorp/fujs';

import Link from '#components/Link';
import { type RiskApiResponse } from '#utils/restRequest';

import { type RiskEventDetailProps } from '../../../RiskImminentEventMap';

type GdacsResponse = RiskApiResponse<'/api/v1/gdacs/'>;
type GdacsItem = NonNullable<GdacsResponse['results']>[number];
type GdacsExposure = RiskApiResponse<'/api/v1/gdacs/{id}/exposure/'>;

interface GdacsEventDetails {
    Class?: string;
    affectedcountries?: {
        iso3: string;
        countryname: string;
    }[];
    alertlevel?: string;
    alertscore?: number;
    country?: string;
    countryonland?: string;
    description?: string;
    episodealertlevel?: string;
    episodealertscore?: number;
    episodeid?: number;
    eventid?: number;
    eventname?: string;
    eventtype?: string;
    fromdate?: string;
    glide?: string;
    htmldescription?: string;
    icon?: string;
    iconoverall?: null,
    iscurrent?: string;
    iso3?: string;
    istemporary?: string;
    name?: string;
    polygonlabel?: string;
    todate?: string;
    severitydata?: {
        severity?: number;
        severitytext?: string;
        severityunit?: string;
    },
    source?: string;
    sourceid?: string;
    url?: {
        report?: string;
        details?: string;
        geometry?: string;
    },
}

interface GdacsPopulationExposure {
    death?: number;
    displaced?: number;
    exposed_population?: string;
    people_affected?: string;
    impact?: string;
}

type Props = RiskEventDetailProps<GdacsItem, GdacsExposure | undefined>;

function EventDetails(props: Props) {
    const {
        data: {
            event_details,
        },
        exposure,
        pending,
        children,
    } = props;

    const populationExposure = exposure?.population_exposure as GdacsPopulationExposure | undefined;
    const eventDetails = event_details as GdacsEventDetails | undefined;

    return (
        <Container pending={pending}>
            <ListView
                layout="block"
                spacing="xs"
            >
                {isDefined(eventDetails?.source) && (
                    <TextOutput
                        label="Forecast provider"
                        value={eventDetails?.source}
                        strongValue
                        withLightBackground
                    />
                )}
                {isDefined(populationExposure?.death) && (
                    <TextOutput
                        label="Estimated deaths"
                        value={populationExposure?.death}
                        maximumFractionDigits={2}
                        compact
                        valueType="number"
                        strongValue
                        withLightBackground
                    />
                )}
                {isDefined(populationExposure?.displaced) && (
                    <TextOutput
                        label="Estimated number of people displaced"
                        value={populationExposure?.displaced}
                        maximumFractionDigits={2}
                        compact
                        valueType="number"
                        strongValue
                        withLightBackground
                    />
                )}
                {isDefined(populationExposure?.exposed_population) && (
                    <TextOutput
                        label="Population exposed"
                        value={populationExposure?.exposed_population}
                        strongValue
                        withLightBackground
                    />
                )}
                {isDefined(populationExposure?.people_affected) && (
                    <TextOutput
                        label="People affected"
                        value={populationExposure?.people_affected}
                        strongValue
                        withLightBackground
                    />
                )}
                {isDefined(populationExposure?.impact) && (
                    <TextOutput
                        label="Impact"
                        value={populationExposure?.impact}
                        strongValue
                        withLightBackground
                    />
                )}
                {isDefined(eventDetails?.severitydata)
                    && (isDefined(eventDetails) && (eventDetails?.eventtype) && !(eventDetails.eventtype === 'FL')) && (
                    <TextOutput
                        label="Severity"
                        value={eventDetails?.severitydata?.severitytext}
                        strongValue
                        withLightBackground
                    />
                )}
                {isDefined(eventDetails?.alertlevel) && (
                    <TextOutput
                        label="Alert Type"
                        value={eventDetails?.alertlevel}
                        strongValue
                        withLightBackground
                    />
                )}
                {isDefined(eventDetails)
                    && isDefined(eventDetails.url)
                    && isDefined(eventDetails.url.report)
                    && (
                        <InlineLayout
                            after={(
                                <Link
                                    href={eventDetails?.url.report}
                                    external
                                    withLinkIcon
                                >
                                    More Details
                                </Link>
                            )}
                        />
                    )}
                {/* NOTE: Intentional additional div to maintain gap */}
                {children && <div />}
                {children}
            </ListView>
        </Container>
    );
}

export default EventDetails;
