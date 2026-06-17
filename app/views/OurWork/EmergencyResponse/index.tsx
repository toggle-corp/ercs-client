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

function EmergencyResponse() {
    const [regionId, setRegionId] = useState<string | undefined>(undefined);

    const [{ data: emergencyResponse, fetching }] = useExternalDashboardsQuery({
        variables: {
            filters: {
                page: DashboardPage.EmergencyResponse,
                isActive: true,
                regions: [regionId ?? ''],
            },
        },
    });

    return (
        <ListView
            layout="block"
        >
            <InlineLayout after={(
                <RegionSelectInput
                    name="region"
                    value={regionId}
                    onChange={setRegionId}
                />
            )}
            />
            <InfoCard
                icon={<AlertLineIcon />}
                title="Emergency Response Overview Dashboard"
                description="Real-time emergency alerts and early warning system monitoring across regions"
            />
            <Container
                pending={fetching}
                empty={!emergencyResponse?.externalDashboards.results.length}
            >
                {emergencyResponse?.externalDashboards.results.map((report) => (
                    <PowerBIEmbed
                        key={report.id}
                        embedUrl={report.url}
                    />
                ))}
            </Container>
        </ListView>
    );
}

export default EmergencyResponse;
