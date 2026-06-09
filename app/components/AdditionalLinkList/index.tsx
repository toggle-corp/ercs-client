import React from 'react';
import {
    Container,
    ListView,
    Pager,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import Link from '#components/Link';
import {
    type LinkTypeEnum,
    usePublicLinksQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PUBLIC_LINKS_QUERY = gql`
    query PublicLinks(
        $limit: Int = 10
        $offset: Int = 0
        $linkType: LinkTypeEnum
    ) {
        publicLinks(
            pagination: { limit: $limit, offset: $offset }
            filters: { linkType: $linkType }
        ) {
            totalCount
            results {
                description
                id
                title
                url
                linkTypeDisplay
                linkType
            }
        }
    }
`;

interface LinkListProps {
    linkType: LinkTypeEnum;
}

function AdditionalLinkList({ linkType }: LinkListProps) {
    const {
        limit,
        page,
        setPage,
        offset,
    } = useFilterState({
        filter: {},
        pageSize: 10,
    });

    const [{ data, fetching }] = usePublicLinksQuery({
        variables: {
            linkType,
            limit,
            offset,
        },
    });

    const items = data?.publicLinks?.results ?? [];

    return (
        <Container
            pending={fetching}
            footerActions={(
                <Pager
                    activePage={page}
                    itemsCount={data?.publicLinks?.totalCount ?? 0}
                    maxItemsPerPage={limit}
                    onActivePageChange={setPage}
                />
            )}
        >
            <ListView
                layout="block"
                spacing="2xl"
            >
                {items.map((item) => (
                    <Container
                        key={item.id}
                        spacingOffset={-2}
                        headingLevel={4}
                        heading={item.title}
                        headerDescription={item.description}
                    >
                        <Link
                            href={item.url}
                            external
                            styleVariant="action"
                            colorVariant="primary"
                        >
                            {item.url}
                        </Link>
                    </Container>
                ))}
            </ListView>
        </Container>
    );
}

export default AdditionalLinkList;
