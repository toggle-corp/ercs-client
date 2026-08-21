import {
    useCallback,
    useEffect,
    useState,
} from 'react';
import { SearchLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    ListView,
    Spinner,
    TextInput,
} from '@ifrc-go/ui';
import { isNotDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import AlbumCard from '#components/AlbumCard';
import Page from '#components/Page';
import {
    type AlbumsQuery,
    useAlbumsQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ALBUMS_QUERY = gql`
    query Albums(
        $pagination: OffsetPaginationInput,
        $filters: GalleryAlbumFilter
    ) {
        galleryAlbums(
            filters: $filters
            pagination: $pagination
        ) {
            totalCount
            results {
                id
                title
                description
                imagesCount
                coverImage {
                    id
                    image {
                        name
                        url
                    }
                }
            }
        }
    }
`;

const PAGE_SIZE = 16;

type Album = NonNullable<AlbumsQuery['galleryAlbums']['results']>[number];

function Galleries() {
    const {
        filter,
        filtered,
        limit,
        page,
        rawFilter,
        rawFiltered,
        resetFilter,
        setFilterField,
        setPage,
        offset,
    } = useFilterState<{
        searchText?: string;
    }>({
        filter: {},
        pageSize: PAGE_SIZE,
    });

    const [albums, setAlbums] = useState<Album[]>();
    const [totalCount, setTotalCount] = useState(0);

    const [{ data, fetching }] = useAlbumsQuery({
        variables: {
            filters: {
                search: filter.searchText,
            },
            pagination: {
                limit,
                offset,
            },
        },
    });

    useEffect(() => {
        if (fetching) {
            return;
        }
        const results = data?.galleryAlbums.results ?? [];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAlbums((prevAlbums) => {
            if (offset === 0 || isNotDefined(prevAlbums)) {
                return results;
            }
            const loadedIds = new Set(prevAlbums.map((item) => item.id));
            const incoming = results.filter((item) => !loadedIds.has(item.id));
            return incoming.length > 0 ? [...prevAlbums, ...incoming] : prevAlbums;
        });
        setTotalCount(data?.galleryAlbums.totalCount ?? 0);
    }, [data, fetching, offset]);

    const hasMoreAlbums = (albums?.length ?? 0) < totalCount;

    const handleLoadMoreClick = useCallback(
        () => {
            setPage(page + 1);
        },
        [page, setPage],
    );

    return (
        <Page
            title="Galleries"
            heading="Galleries"
            description="Capturing moments of service, resilience, and community impact."
        >
            <Container
                heading="Albums"
                headingLevel={4}
                withHeaderBorder
            >
                <ListView layout="block">
                    <ListView className={styles.filters}>
                        <TextInput
                            className={styles.searchInput}
                            name="searchText"
                            placeholder="Search"
                            value={rawFilter.searchText}
                            onChange={setFilterField}
                            icons={<SearchLineIcon />}
                        />
                        <Button
                            name={undefined}
                            onClick={resetFilter}
                            disabled={!rawFiltered}
                            styleVariant="outline"
                            colorVariant="primary"
                        >
                            Clear
                        </Button>
                    </ListView>
                    <Container
                        pending={fetching && isNotDefined(albums)}
                        empty={albums?.length === 0}
                        filtered={filtered}
                        emptyMessage="No albums yet"
                        filteredEmptyMessage="No albums match this search"
                        footer={hasMoreAlbums ? (
                            <ListView withCenteredContents>
                                <Button
                                    name={undefined}
                                    onClick={handleLoadMoreClick}
                                    disabled={fetching}
                                    after={fetching ? <Spinner /> : undefined}
                                    styleVariant="outline"
                                    colorVariant="primary"
                                >
                                    Load More
                                </Button>
                            </ListView>
                        ) : undefined}
                    >
                        <ListView
                            layout="grid"
                            numPreferredGridColumns={4}
                            minGridColumnSize="11.25rem"
                        >
                            {albums?.map((album) => (
                                <AlbumCard
                                    key={album.id}
                                    albumId={album.id}
                                    title={album.title}
                                    imagesCount={album.imagesCount}
                                    coverImageUrl={album.coverImage?.image.url}
                                />
                            ))}
                        </ListView>
                    </Container>
                </ListView>
            </Container>
        </Page>
    );
}

export default Galleries;
