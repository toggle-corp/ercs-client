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

function EmergencyResponse() {
    //  Todo: Region filter
    const [{ data: emergencyResponse, fetching }] = useExternalDashboardsQuery({
        variables: {
            // NOTE: Page variable value based on page enum where 70 is emergency response
            page: '70',
            isActive: true,
        },

    });
    return (
        <Container
            pending={fetching}
            empty={emergencyResponse?.externalDashboards.results.length === 0}
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
                {emergencyResponse?.externalDashboards.results.map((report) => (
                    <PowerBIEmbed
                        key={report.id}
                        embedUrl={report.url}
                    />
                ))}
            </ListView>
        </Container>
    );
}

export default EmergencyResponse;
