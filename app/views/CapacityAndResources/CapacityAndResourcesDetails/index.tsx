import { useParams } from 'react-router';
import {
    Container,
    ListView,
} from '@ifrc-go/ui';
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
            dashboards {
                url
                id
                title
                description
            }
        }
    }
`;

export default function CapacityAndResourcesDetails() {
    const { id } = useParams<{ id: string }>();

    const [{ data, fetching: pending }] = useCapacityAndResourceQuery({
        variables: { id: id! },
        pause: !id,
    });

    const resourceData = data?.capacityAndResource;

    return (
        <Page
            heading={resourceData?.title}
            description={resourceData?.description}
        >
            <Container
                pending={pending}
            >
                <ListView
                    layout="block"
                >
                    {resourceData?.dashboards && resourceData?.dashboards.map((items) => (
                        <PowerBIEmbed
                            key={items.id}
                            embedUrl={items.url ?? ''}
                        />
                    ))}

                </ListView>
            </Container>
        </Page>
    );
}
