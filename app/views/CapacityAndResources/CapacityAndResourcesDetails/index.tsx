import { useParams } from 'react-router';
import { gql } from 'urql';

import Page from '#components/Page';
import PowerBIEmbed from '#components/PowerBiEmbed';
import { useCapacityAndResourceQuery } from '#generated/types/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CAPACITY_AND_RESOURCES_DETAIL_QUERY = gql`
    query CapacityAndResource(
        $id: ID!
    ) {
        capacityAndResource(id: $id) {
            title
            id
            description
            iframeUrls {
                dashboard {
                    url
                    title
                    description
                }
            }
        }
    }
`;

export default function CapacityAndResourcesDetails() {
    const { id } = useParams<{ id: string }>();

    const [{ data }] = useCapacityAndResourceQuery({
        variables: { id: id! },
        pause: !id,
    });

    const resourceData = data?.capacityAndResource;

    return (
        <Page
            heading={resourceData?.title}
            description={resourceData?.description}
        >
            {resourceData?.iframeUrls.map((items) => (
                <PowerBIEmbed
                    key={resourceData.id}
                    embedUrl={items.dashboard.url ?? ''}
                />
            ))}
        </Page>
    );
}
