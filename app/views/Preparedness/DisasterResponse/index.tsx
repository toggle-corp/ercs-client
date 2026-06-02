import { AlertLineIcon } from '@ifrc-go/icons';
import {
    Container,
    ListView,
} from '@ifrc-go/ui';

import InfoCard from '#components/InfoCard';
import PowerBIEmbed from '#components/PowerBiEmbed';
import { useExternalDashboardsQuery } from '#generated/types/graphql';

function DisasterResponse() {
    //  Todo: Region filter
    const [{ data: disasterResponse, fetching }] = useExternalDashboardsQuery({

        variables: {
            // NOTE: Page variable value based on page enum where 60 is disaster response
            page: '60',
            isActive: true,
        },

    });
    return (
        <Container
            pending={fetching}
            empty={disasterResponse?.externalDashboards.results.length === 0}
        >
            <ListView
                layout="block"
                spacing="2xl"
            >
                <InfoCard
                    icon={<AlertLineIcon />}
                    title="Alerts Dashboard"
                    description="Real-time emergency alerts and early warning system monitoring across regions"
                />
                {disasterResponse?.externalDashboards.results.map((report) => (
                    <PowerBIEmbed
                        key={report.id}
                        embedUrl={report.url}
                    />
                ))}
            </ListView>
        </Container>
    );
}
export default DisasterResponse;
