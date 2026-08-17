import { MapIcon } from '@ifrc-go/icons';
import {
    Container,
    ListView,
} from '@ifrc-go/ui';

import InfoCard from '#components/InfoCard';
import PowerBIEmbed from '#components/PowerBiEmbed';
import {
    DashboardPage,
    useExternalDashboardsQuery,
} from '#generated/types/graphql';

function ProjectMapping() {
    const [{ data: projectMappingData, fetching }] = useExternalDashboardsQuery({
        variables: {
            filters: {
                page: DashboardPage.ProjectMapping,
                isActive: true,
            },
        },

    });
    return (
        <Container
            pending={fetching}
            empty={projectMappingData?.externalDashboards.results.length === 0}
        >
            <ListView
                layout="block"
                spacing="2xl"
            >
                <InfoCard
                    icon={<MapIcon />}
                    title="Project Mapping Dashboard"
                    description="Real-time emergency alerts and early warning system monitoring across regions"
                />
                {projectMappingData?.externalDashboards.results.map((dashboard) => (
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
    );
}

export default ProjectMapping;
