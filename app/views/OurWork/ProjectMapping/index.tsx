import { AlertLineIcon } from '@ifrc-go/icons';
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
    //  Todo: Region filter
    const [{ data: projectMappingData, fetching }] = useExternalDashboardsQuery({
        variables: {
            page: DashboardPage.ProjectMapping,
            isActive: true,
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
                    icon={<AlertLineIcon />}
                    title="Emergency Response Overview Dashboard"
                    description="Real-time emergency alerts and early warning system monitoring across regions"
                />
                {projectMappingData?.externalDashboards.results.map((report) => (
                    <PowerBIEmbed
                        key={report.id}
                        embedUrl={report.url}
                    />
                ))}
            </ListView>
        </Container>
    );
}

export default ProjectMapping;
