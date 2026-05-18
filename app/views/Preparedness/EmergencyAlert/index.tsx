import { AlertLineIcon } from '@ifrc-go/icons';
import {
    Container,
    ListView,
} from '@ifrc-go/ui';

import InfoCard from '#components/InfoCard';
import PowerBIEmbed from '#components/PowerBiEmbed';
import { useExternalDashboardsQuery } from '#generated/types/graphql';

function EmergencyAlert() {
    //  Todo: Region filter
    const [{ data: emergencyAlert, fetching }] = useExternalDashboardsQuery({
        variables: {
            page: '50',
            isActive: true,
        },

    });
    return (
        <Container
            pending={fetching}
            empty={emergencyAlert?.externalDashboards.results.length === 0}
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
                {emergencyAlert?.externalDashboards.results.map((report) => (
                    <PowerBIEmbed
                        key={report.id}
                        embedUrl={report.url}
                    />
                ))}
            </ListView>
        </Container>
    );
}
export default EmergencyAlert;
