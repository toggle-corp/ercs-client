import { AlertLineIcon } from '@ifrc-go/icons';
import {
    Container,
    ListView,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import InfoCard from '#components/InfoCard';
import PowerBIEmbed from '#components/PowerBiEmbed';
import { useExternalDashboardsQuery } from '#generated/types/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ExternalDashboards_QUERY = gql`
    query ExternalDashboards(
        $page: String = ""
        $isActive: Boolean = true
    ) {
        externalDashboards(
            filters: { page: $page, isActive: $isActive }
        ) {
            results {
                title
                updatedAt
                order
                id
                isActive
                createdAt
                description
                page
                regionId
                showOnHome
                url
            }
            pageInfo {
                limit
                offset
            }
            totalCount
        }
    }
`;

function ProjectMapping() {
    //  Todo:Region filter
    const [{ data: projectMappingData, fetching }] = useExternalDashboardsQuery({
        variables: {
            page: '30',
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
