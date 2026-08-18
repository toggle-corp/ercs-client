import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    ChevronUpLineIcon,
    SearchLineIcon,
} from '@ifrc-go/icons';
import {
    Button,
    Container,
    Description,
    Heading,
    IconButton,
    InlineView,
    ListView,
    NavigationTabList,
    Spinner,
    TabLayout,
    TextInput,
} from '@ifrc-go/ui';
import { _cs } from '@togglecorp/fujs';
import { gql } from 'urql';

import Page from '#components/Page';
import {
    type AlbumsQuery,
    useAlbumsQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import Photos from '#views/Galleries/Photos';

import styles from './styles.module.css';

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
    // NOTE: The album list is scrollable, so an indicator is shown at the top
    // whenever there are albums scrolled out of view above.
    const [hasContentAbove, setHasContentAbove] = useState(false);
    const albumListRef = useRef<HTMLDivElement>(null);
    // NOTE: Set only when show more is clicked, so the list is scrolled down to
    // the freshly appended albums, and not on the first load or on a search.
    const shouldScrollToBottomRef = useRef(false);
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

    // NOTE: Albums are accumulated across pages for the show more button. The
    // page is reset to 1 on every filter change, so an offset of 0 always means
    // a fresh list (first load, a new search, or the search being cleared) and
    // has to replace what is there instead of appending to it.
    useEffect(() => {
        if (fetching) {
            return;
        }
        const results = data?.galleryAlbums.results ?? [];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAlbumData((prev) => {
            if (offset === 0) {
                return results;
            }
            const existingIds = new Set(prev.map((item) => item.id));
            const incoming = results.filter((item) => !existingIds.has(item.id));
            return incoming.length > 0 ? [...prev, ...incoming] : prev;
        });
        if (offset === 0) {
            albumListRef.current?.scrollTo({ top: 0 });
        }
    }, [data, fetching, offset]);

    const handleAlbumListScroll = useCallback(
        (event: React.UIEvent<HTMLDivElement>) => {
            setHasContentAbove(event.currentTarget.scrollTop > 0);
        },
        [],
    );

    useEffect(() => {
        if (!shouldScrollToBottomRef.current) {
            return;
        }
        shouldScrollToBottomRef.current = false;
        const element = albumListRef.current;
        element?.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth',
        });
    }, [albumData]);

    const handleShowMoreClick = useCallback(
        () => {
            shouldScrollToBottomRef.current = true;
            setPage(page + 1);
        },
        [page, setPage],
    );

    const handleScrollToTopClick = useCallback(
        () => {
            albumListRef.current?.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        },
        [],
    );

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
                            // NOTE: Only the very first load blanks out the list. Fetching
                            // further pages is shown on the show more button instead, so
                            // the list neither collapses nor loses its scroll position.
                            pending={fetching && albumData.length === 0}
                            empty={albumData.length === 0}
                            emptyMessage="No events found"
                        >

                            <div className={styles.albumList}>
                                <div
                                    className={_cs(
                                        styles.scrollIndicator,
                                        hasContentAbove && styles.visible,
                                    )}
                                >
                                    <IconButton
                                        name="scroll-to-top"
                                        ariaLabel="scroll to the top of the event list"
                                        title="scroll to top"
                                        variant="tertiary"
                                        className={styles.scrollToTopButton}
                                        onClick={handleScrollToTopClick}
                                    >
                                        <ChevronUpLineIcon />
                                    </IconButton>
                                </div>
                                <div
                                    className={styles.scrollableContent}
                                    ref={albumListRef}
                                    onScroll={handleAlbumListScroll}
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
                                </div>
                            </div>
                        </Container>
                        {(data?.galleryAlbums?.totalCount ?? 0)
                        > albumData.length && (
                            <InlineView
                                after={(
                                    <Button
                                        name="show-more"
                                        onClick={handleShowMoreClick}
                                        disabled={fetching}
                                        after={fetching ? <Spinner /> : undefined}
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
