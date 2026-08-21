import { useState } from 'react';
import { useParams } from 'react-router';
import {
    Container,
    ListView,
} from '@ifrc-go/ui';
import { isDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import Page from '#components/Page';
import PowerBIEmbed from '#components/PowerBiEmbed';
import RegionSelectInput from '#components/RegionSelectInput';
import { useCapacityAndResourcesAndDashboardsQuery } from '#generated/types/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CAPACITY_AND_RESOURCES_AND_DASHBOARDS_QUERY = gql`
    query CapacityAndResourcesAndDashboards(
        $id: ID!
        $pagination: OffsetPaginationInput
        $filters: ExternalDashboardFilter
    ) {
        capacityAndResource(id: $id) {
            id
            title
            description
        }

        externalDashboards(
            filters: $filters
            pagination: $pagination
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
                pageDisplay
                url
            }
            totalCount
        }
    }
`;

export default function CapacityAndResourcesDetails() {
    const { id: capacityAndResourceId } = useParams<{ id: string }>();
    const [regionId, setRegionId] = useState<string | undefined>(undefined);

    const [{ data, fetching: pending }] = useCapacityAndResourcesAndDashboardsQuery({
        variables: {
            id: capacityAndResourceId ?? '',
            filters: {
                regions: isDefined(regionId) ? [regionId] : null,
                capacityAndResources: isDefined(capacityAndResourceId)
                    ? [capacityAndResourceId] : null,
                isActive: true,
            },
        },
        pause: !capacityAndResourceId,
    });

    const resourceData = data?.capacityAndResource;
    const dashboards = data?.externalDashboards.results;

    return (
        <Page
            title={resourceData?.title}
            heading={resourceData?.title}
            description={resourceData?.description}
            actions={(
                <RegionSelectInput
                    name="region"
                    value={regionId}
                    onChange={setRegionId}
                />
            )}
        >
            <Container
                pending={pending}
                empty={dashboards?.length === 0}
                emptyMessage="No dashboards found for the selected capacity and resource."
            >
                <ListView
                    layout="block"
                >
                    {dashboards?.map((dashboard) => (
                        <PowerBIEmbed
                            key={dashboard.id}
                            embedUrl={dashboard.url ?? ''}
                        />
                    ))}
                </ListView>
            </Container>
        </Page>
    );
}
