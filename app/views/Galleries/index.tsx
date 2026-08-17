import {
    useEffect,
    useState,
} from 'react';
import { SearchLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    Description,
    Heading,
    InlineView,
    ListView,
    NavigationTabList,
    TabLayout,
    TextInput,
} from '@ifrc-go/ui';
import { isNotDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import Page from '#components/Page';
import {
    type AlbumsQuery,
    useAlbumsQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import Photos from '#views/Galleries/Photos';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ALBUM_QUERY = gql`
    query Albums(
        $pagination: OffsetPaginationInput,
        $filters: GalleryAlbumFilter
    ) {
        galleryAlbums(
            filters: $filters
            pagination: $pagination
        ) {
            results {
                title
                updatedAt
                id
                description
            }
            totalCount
        }
    }
`;
type AlbumList = NonNullable<AlbumsQuery['galleryAlbums']['results']>[number];

function Galleries() {
    const [activeId, setActiveId] = useState('');
    const [albumData, setAlbumData] = useState<AlbumList[]>([]);
    const albumId = activeId || albumData[0]?.id || '';
    const {
        filter,
        limit,
        page,
        rawFilter,
        setFilterField,
        setPage,
        offset,
    } = useFilterState<{
        searchText?: string
    }>({
        filter: {},
        pageSize: 5,
    });

    const [{ data, fetching }] = useAlbumsQuery(({
        variables: {
            filters: {
                search: filter.searchText,
            },
            pagination: {
                limit,
                offset,
            },
        },
    }));

    useEffect(() => {
        if (!data?.galleryAlbums?.results?.length) return;
        if (filter.searchText) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAlbumData(data?.galleryAlbums.results ?? []);
        }
        setAlbumData((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const incoming = data.galleryAlbums.results.filter((a) => !existingIds.has(a.id));
            return incoming.length ? [...prev, ...incoming] : prev;
        });
    }, [data, filter.searchText]);

    return (
        <Page
            heading="Galleries"
            description="Capturing moments of service, resilience, and community impact."
            info={(
                <Description withCenteredContent>
                    <i>
                        {data?.galleryAlbums.totalCount}
                        {' '}
                        Events
                    </i>
                </Description>
            )}
        >
            <ListView
                layout="block"
                spacing="xs"
            >
                <Heading
                    level={4}
                >
                    Events
                </Heading>
                <ListView
                    layout="grid"
                    withSidebar
                    sidebarPosition="start"
                >
                    <ListView
                        layout="block"
                    >
                        <TextInput
                            name="searchText"
                            placeholder="Search"
                            value={rawFilter.searchText}
                            onChange={setFilterField}
                            icons={<SearchLineIcon />}
                        />
                        <Container
                            pending={fetching}
                            empty={isNotDefined(data) || data.galleryAlbums.results.length === 0}
                            emptyMessage="No events found"
                        >

                            <NavigationTabList
                                styleVariant="vertical"
                            >
                                {albumData.map((item) => (
                                    <TabLayout
                                        key={item.id}
                                        styleVariant="vertical"
                                        active={albumId === item.id}
                                        onClickCapture={() => setActiveId(item.id)}
                                    >
                                        {item.title}
                                    </TabLayout>
                                ))}
                            </NavigationTabList>
                        </Container>
                        {(data?.galleryAlbums?.totalCount ?? 0)
                        > albumData.length && (
                            <InlineView
                                after={(
                                    <Button
                                        name="show-more"
                                        onClick={() => {
                                            setPage(page + 1);
                                        }}
                                        styleVariant="action"
                                    >
                                        show more
                                    </Button>
                                )}
                            />
                        )}
                    </ListView>
                    <Photos
                        key={albumId}
                        albumId={albumId}
                    />
                </ListView>
            </ListView>
        </Page>
    );
}

export default Galleries;
