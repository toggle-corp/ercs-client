import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useParams } from 'react-router';
import {
    Button,
    Container,
    Description,
    ListView,
    Spinner,
} from '@ifrc-go/ui';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import { gql } from 'urql';

import Page from '#components/Page';
import {
    type AlbumImagesQuery,
    Ordering,
    useAlbumImagesQuery,
    useGalleryAlbumQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

import PhotoTile from './PhotoTile';
import PhotoViewer from './PhotoViewer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GALLERY_ALBUM_QUERY = gql`
    query GalleryAlbum($id: ID!) {
        galleryAlbum(id: $id) {
            id
            title
            description
        }
    }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ALBUM_IMAGES_QUERY = gql`
    query AlbumImages(
        $pagination: OffsetPaginationInput,
        $filters: GalleryImageFilter,
        $order: GalleryImageOrder
    ) {
        galleryImages(
            filters: $filters
            pagination: $pagination
            order: $order
        ) {
            totalCount
            results {
                id
                caption
                image {
                    name
                    url
                }
            }
        }
    }
`;

const PAGE_SIZE = 24;
const IMAGE_ORDER = { order: Ordering.Asc };

type AlbumImage = NonNullable<AlbumImagesQuery['galleryImages']['results']>[number];

function AlbumDetail() {
    const { id: albumId } = useParams<{ id: string }>();
    const {
        limit,
        offset,
        page,
        setPage,
    } = useFilterState({
        filter: {},
        pageSize: PAGE_SIZE,
    });
    const [images, setImages] = useState<AlbumImage[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState<number>();

    const [{
        data: albumResponse,
        fetching: albumPending,
        error: albumError,
    }] = useGalleryAlbumQuery({
        variables: {
            id: albumId ?? '',
        },
        pause: isNotDefined(albumId),
    });

    const [{
        data: imagesResponse,
        fetching: imagesPending,
    }] = useAlbumImagesQuery({
        variables: {
            filters: {
                albumId,
            },
            order: IMAGE_ORDER,
            pagination: {
                limit,
                offset,
            },
        },
        pause: isNotDefined(albumId),
    });

    useEffect(() => {
        if (imagesPending) {
            return;
        }
        const results = imagesResponse?.galleryImages.results ?? [];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImages((prevImages) => {
            if (offset === 0 || isNotDefined(prevImages)) {
                return results;
            }
            const loadedIds = new Set(prevImages.map((item) => item.id));
            const incoming = results.filter((item) => !loadedIds.has(item.id));
            return incoming.length > 0 ? [...prevImages, ...incoming] : prevImages;
        });
        setTotalCount(imagesResponse?.galleryImages.totalCount ?? 0);
    }, [imagesResponse, imagesPending, offset]);

    const album = albumResponse?.galleryAlbum;
    const hasMoreImages = (images?.length ?? 0) < totalCount;
    const pendingPage = offset !== PAGE_SIZE * (page - 1);
    const loadMorePending = imagesPending || pendingPage;

    const [{
        data: allImagesResponse,
        fetching: allImagesPending,
    }] = useAlbumImagesQuery({
        variables: {
            filters: {
                albumId,
            },
            order: IMAGE_ORDER,
            pagination: {
                limit: totalCount,
                offset: 0,
            },
        },
        pause: isNotDefined(albumId) || isNotDefined(activeIndex) || totalCount === 0,
    });

    const imageUrls = useMemo(
        () => allImagesResponse?.galleryImages.results.map(
            (item) => (item.image.url),
        ),
        [allImagesResponse],
    );

    const handleLoadMoreClick = useCallback(
        () => {
            setPage(page + 1);
        },
        [page, setPage],
    );

    const handleViewerClose = useCallback(
        () => {
            setActiveIndex(undefined);
        },
        [],
    );

    return (
        <>
            {isDefined(activeIndex) && (
                <PhotoViewer
                    imageUrls={imageUrls}
                    index={activeIndex}
                    totalCount={totalCount}
                    pending={allImagesPending || isNotDefined(imageUrls)}
                    onIndexChange={setActiveIndex}
                    onClose={handleViewerClose}
                />
            )}
            <Page
                title={album?.title}
                heading={album?.title}
                description={album?.description}
                info={isDefined(images) ? (
                    <Description withCenteredContent>
                        <i>
                            {totalCount === 1 ? '1 photo' : `${totalCount} photos`}
                        </i>
                    </Description>
                ) : undefined}
            >
                <Container
                    pending={albumPending || (loadMorePending && isNotDefined(images))}
                    errored={isDefined(albumError)}
                    errorMessage="This album could not be loaded."
                    empty={images?.length === 0}
                    emptyMessage="No photos in this album yet"
                    footer={hasMoreImages ? (
                        <ListView withCenteredContents>
                            <Button
                                name={undefined}
                                onClick={handleLoadMoreClick}
                                disabled={loadMorePending}
                                after={loadMorePending ? <Spinner /> : undefined}
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
                        minGridColumnSize="10rem"
                    >
                        {images?.map((item, index) => (
                            <PhotoTile
                                key={item.id}
                                index={index}
                                url={item.image.url}
                                name={item.image.name}
                                caption={item.caption}
                                totalCount={totalCount}
                                onViewClick={setActiveIndex}
                            />
                        ))}
                    </ListView>
                </Container>
            </Page>
        </>
    );
}

export default AlbumDetail;
