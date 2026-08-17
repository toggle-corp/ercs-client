import { useState } from 'react';
import { EmergencyResponseUnitIcon } from '@ifrc-go/icons';
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

function DisasterResponse() {
    const [regionId, setRegionId] = useState<string | undefined>(undefined);
    const [{ data: disasterResponse, fetching }] = useExternalDashboardsQuery({
        variables: {
            filters: {
                page: DashboardPage.DisasterResponse,
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
                icon={<EmergencyResponseUnitIcon />}
                title="Disaster Response Dashboard"
                description="Real-time emergency alerts and early warning system monitoring across regions"
            />
            <Container
                pending={fetching}
                empty={disasterResponse?.externalDashboards.results.length === 0}
            >
                <ListView
                    layout="block"
                    spacing="2xl"
                >
                    {disasterResponse?.externalDashboards.results.map((dashboard) => (
                        <Container
                            key={dashboard.id}
                            heading={dashboard.title}
                            headingLevel={4}
                            headerDescription={dashboard.description}
                            withHeaderBorder
                        >
                            <PowerBIEmbed
                                embedUrl={dashboard.url}
                            />
                        </Container>
                    ))}
                </ListView>
            </Container>
        </ListView>
    );
}
export default DisasterResponse;
