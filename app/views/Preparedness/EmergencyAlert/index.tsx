import { useState } from 'react';
import { AlertLineIcon } from '@ifrc-go/icons';
import {
    Container,
    InlineLayout,
    ListView,
} from '@ifrc-go/ui';

import InfoCard from '#components/InfoCard';
import PowerBIEmbed from '#components/PowerBiEmbed';
import RegionSelectInput from '#components/RegionSelectInput';
import {
    DashboardPage,
    useExternalDashboardsQuery,
} from '#generated/types/graphql';

function EmergencyAlert() {
    const [regionId, setRegionId] = useState<string | undefined>(undefined);

    const [{ data: emergencyAlert, fetching }] = useExternalDashboardsQuery({
        variables: {
            filters: {
                page: DashboardPage.EmergencyAlerts,
                isActive: true,
                regions: regionId ? [regionId] : null,
            },
        },
    });

    return (
        <ListView
            layout="block"
        >
            <InlineLayout
                after={(
                    <RegionSelectInput
                        name="region"
                        value={regionId}
                        onChange={setRegionId}
                    />
                )}
            />
            <InfoCard
                icon={<AlertLineIcon />}
                title="Alerts Dashboard"
                description="Real-time emergency alerts and early warning system monitoring across regions"
            />
            <Container
                pending={fetching}
                empty={emergencyAlert?.externalDashboards.results.length === 0}
            >
                {emergencyAlert?.externalDashboards.results.map((report) => (
                    <PowerBIEmbed
                        key={report.id}
                        embedUrl={report.url}
                    />
                ))}
            </Container>
        </ListView>
    );
}
export default EmergencyAlert;
