import React, { useState } from 'react';
import {
    Container,
    ListView,
    Pager,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import Link from '#components/Link';
import Page from '#components/Page';
import { usePublicLinksQuery } from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

type TabKey = 'internal' | 'external';

const LINK_TYPE = {
    INTERNAL: 10,
    EXTERNAL: 20,
} as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PUBLIC_LINKS_QUERY = gql`
    query PublicLinks(
        $limit: Int = 10
        $offset: Int = 0
        $linkType: Int
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
    linkType: typeof LINK_TYPE[keyof typeof LINK_TYPE];
}

function LinkList({ linkType }: LinkListProps) {
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

function AdditionalLinks() {
    const [activeTab, setActiveTab] = useState<TabKey>('internal');

    return (
        <Page
            heading="Additional Links"
            description="Explore additional resources and important links"
        >
            <Tabs
                styleVariant="tab"
                value={activeTab}
                onChange={setActiveTab}
            >
                <TabList>
                    <Tab name="internal">
                        Internal Links
                    </Tab>
                    <Tab name="external">
                        External Links
                    </Tab>
                </TabList>
                <TabPanel name="internal">
                    <LinkList linkType={LINK_TYPE.INTERNAL} />
                </TabPanel>
                <TabPanel name="external">
                    <LinkList linkType={LINK_TYPE.EXTERNAL} />
                </TabPanel>
            </Tabs>
        </Page>
    );
}

export default AdditionalLinks;
