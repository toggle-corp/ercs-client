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
        $pagination: OffsetPaginationInput,
        $filters: LinkFilter
    ) {
        publicLinks(
            filters: $filters
            pagination: $pagination
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
            filters: {
                linkType,
            },
            pagination: {
                limit,
                offset,
            },
        },
    });

    const links = data?.publicLinks?.results ?? [];

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
            empty={links.length === 0}
            emptyMessage={`No ${linkType.toLowerCase()} links found.`}
        >
            <ListView
                layout="block"
                spacing="2xl"
            >
                {links.map((link) => (
                    <Container
                        key={link.id}
                        spacingOffset={-2}
                        headingLevel={4}
                        heading={link.title}
                        headerDescription={link.description}

                    >
                        <Link
                            href={link.url}
                            external
                            styleVariant="action"
                            colorVariant="primary"
                        >
                            {link.url}
                        </Link>
                    </Container>
                ))}
            </ListView>
        </Container>
    );
}

export default AdditionalLinkList;
