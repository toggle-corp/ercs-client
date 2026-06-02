import {
    Container,
    ListView,
    TextOutput,
} from '@ifrc-go/ui';

import { type RiskApiResponse } from '#utils/restRequest';

import { type RiskEventDetailProps } from '../../../RiskImminentEventMap';

type PdcResponse = RiskApiResponse<'/api/v1/pdc/'>;
type PdcEventItem = NonNullable<PdcResponse['results']>[number];
type PdcExposure = RiskApiResponse<'/api/v1/pdc/{id}/exposure/'>;

type Props = RiskEventDetailProps<PdcEventItem, PdcExposure | undefined>;

function EventDetails(props: Props) {
    const {
        data: {
            pdc_created_at,
            pdc_updated_at,
            description,
        },
        exposure,
        pending,
        children,
    } = props;

    interface Exposure {
        value?: number | null;
        valueFormatted?: string | null;
    }

    // NOTE: these are stored as json so we don't have typings for these
    const popExposure = exposure?.population_exposure as {
        total?: Exposure | null;
        households?: Exposure | null;
        vulnerable?: Exposure | null;
    } | null;

    // NOTE: these are stored as json so we don't have typings for these
    const capitalExposure = exposure?.capital_exposure as {
        total?: Exposure | null;
        school?: Exposure | null;
        hospital?: Exposure | null;
    } | null;

    return (
        <Container pending={pending}>
            <ListView
                layout="block"
                spacing="xs"
            >
                <TextOutput
                    label="Created on"
                    value={pdc_created_at}
                    valueType="date"
                    strongValue
                    withLightBackground
                />
                <TextOutput
                    label="Updated on"
                    value={pdc_updated_at}
                    valueType="date"
                    strongValue
                    withLightBackground
                />
                <TextOutput
                    label="People exposed / Potentially affected"
                    value={popExposure?.total?.valueFormatted}
                    strongValue
                    withLightBackground
                />
                <TextOutput
                    label="Households exposed"
                    value={popExposure?.households?.valueFormatted}
                    strongValue
                    withLightBackground
                />
                <TextOutput
                    label="People in vulnerable groups exposed to the hazard"
                    value={popExposure?.vulnerable?.valueFormatted}
                    strongValue
                    withLightBackground
                />
                <TextOutput
                    label="Value (USD) of exposed buildings"
                    value={capitalExposure?.total?.valueFormatted}
                    strongValue
                    withLightBackground
                />
                <TextOutput
                    label="Schools exposed"
                    value={capitalExposure?.school?.valueFormatted}
                    strongValue
                    withLightBackground
                />
                <TextOutput
                    label="Hospital exposed"
                    value={capitalExposure?.hospital?.valueFormatted}
                    strongValue
                    withLightBackground
                />
                <TextOutput
                    valueType="text"
                    value={description}
                    withLightBackground
                />
                {children}
            </ListView>
        </Container>
    );
}

export default EventDetails;
