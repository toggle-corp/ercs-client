import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    ChevronLeftLineIcon,
    ChevronRightLineIcon,
    DownloadTwoFillIcon,
    EyeFillIcon,
} from '@ifrc-go/icons';
import {
    Container,
    IconButton,
    Image,
    ListView,
    Modal,
    Pager,
    RawButton,
} from '@ifrc-go/ui';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import { saveAs } from 'file-saver';
import { gql } from 'urql';

import { useGalleryQuery } from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IMAGES_QUERY = gql`
    query Gallery(
        $pagination: OffsetPaginationInput,
        $filters: GalleryImageFilter
    ) {
        galleryImages(
            filters: $filters
            pagination: $pagination
        ) {
            totalCount
            results {
                id
                image {
                    name
                    url
                }
            }
        }
    }
`;
// For Local Development
const toSafeSrc = (src: string) => (src.startsWith('http')
    ? src.replace(/^http:\/\/web:8000/, 'http://localhost:8000')
    : src);

interface ImageViewerProps {
    images: string[] | undefined;
    index: number;
    totalCount: number;
    pending: boolean;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}

function ImageViewer(props: ImageViewerProps) {
    const {
        images,
        index,
        totalCount,
        pending,
        onIndexChange,
        onClose,
    } = props;

    const hasPrev = isDefined(images) && index > 0;
    const hasNext = isDefined(images) && index < images.length - 1;

    useEffect(() => {
        if (isNotDefined(images)) {
            return undefined;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' && index > 0) {
                onIndexChange(index - 1);
            }
            if (event.key === 'ArrowRight' && index < images.length - 1) {
                onIndexChange(index + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [index, images, onIndexChange]);

    const src = images?.[index];

    return (
        <Modal
            closeOnClickOutside
            closeOnEscape
            onClose={onClose}
            size="lg"
            footerIcons={(
                <IconButton
                    name={index - 1}
                    ariaLabel="previous image"
                    title="previous image"
                    round={false}
                    variant="secondary"
                    disabled={!hasPrev}
                    onClick={onIndexChange}
                >
                    <ChevronLeftLineIcon />
                </IconButton>
            )}
            footer={pending
                ? `${index + 1} / ${totalCount} · loading…`
                : `${index + 1} / ${totalCount}`}
            footerActions={(
                <IconButton
                    name={index + 1}
                    ariaLabel="next image"
                    title="next image"
                    round={false}
                    variant="secondary"
                    disabled={!hasNext}
                    onClick={onIndexChange}
                >
                    <ChevronRightLineIcon />
                </IconButton>
            )}
        >
            <Image
                src={src}
                alt={src}
                className={styles.image}
                imgElementClassName={styles.img}
                withContainedFit
                withoutCaption
            />
        </Modal>
    );
}

interface ImageComponentProps {
    src: string;
    name: string;
    index: number;
    onView: (index: number) => void;
}

function ImageComponent(props: ImageComponentProps) {
    const {
        src, name,
        index,
        onView,
    } = props;
    const safeSrc = toSafeSrc(src);

    const handleDownloadClick = () => {
        saveAs(safeSrc, name);
    };

    return (
        <div className={styles.imgContainer}>
            <RawButton
                name={index}
                onClick={onView}
                className={styles.imgButton}
                aria-label={`open ${name}`}
            >
                <Image src={safeSrc} size="md" />
            </RawButton>
            <ListView
                spacing="3xs"
                className={styles.actionButton}
                withPadding
            >
                <IconButton
                    name="download"
                    ariaLabel="download"
                    title="download"
                    round={false}
                    variant="secondary"
                    onClick={handleDownloadClick}
                >
                    <DownloadTwoFillIcon />
                </IconButton>
                <IconButton
                    name={index}
                    ariaLabel="open"
                    title="open"
                    round={false}
                    variant="secondary"
                    onClick={onView}
                >
                    <EyeFillIcon />
                </IconButton>
            </ListView>
        </div>
    );
}

interface Props {
    albumId: string;
    heading?: React.ReactNode;
    description?: React.ReactNode;
}

function Photos(props: Props) {
    const {
        albumId,
        heading,
        description,
    } = props;
    // NOTE: This is the index within the whole album, not within the page.
    const [activeIndex, setActiveIndex] = useState<number>();
    const {
        limit,
        page,
        setPage,
        offset,
    } = useFilterState({
        filter: {},
        pageSize: 12,
    });

    const [{ fetching: imageLoading, data: imageData }] = useGalleryQuery({
        variables: {
            filters: {
                albumId,
            },
            pagination: {
                limit,
                offset,
            },
        },
        pause: !albumId,
    });

    const results = imageData?.galleryImages.results;
    const totalCount = imageData?.galleryImages?.totalCount ?? 0;

    // NOTE: Prev/next has to walk the whole album, not just the visible page,
    // so the full list of urls is fetched alongside the paginated grid.
    const [{
        fetching: allImagesLoading,
        data: allImageData,
    }] = useGalleryQuery({
        variables: {
            filters: {
                albumId,
            },
            pagination: {
                limit: totalCount,
                offset: 0,
            },
        },
        pause: !albumId || totalCount === 0,
    });

    const allImages = useMemo(
        () => allImageData?.galleryImages.results.map((item) => toSafeSrc(item.image.url)),
        [allImageData],
    );

    const handleView = useCallback(
        (index: number) => {
            setActiveIndex(offset + index);
        },
        [offset],
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
                <ImageViewer
                    images={allImages}
                    index={activeIndex}
                    totalCount={totalCount}
                    pending={allImagesLoading || isNotDefined(allImages)}
                    onIndexChange={setActiveIndex}
                    onClose={handleViewerClose}
                />
            )}
            <Container
                heading={heading}
                headerDescription={description}
                pending={imageLoading}
                footerActions={(
                    <Pager
                        activePage={page}
                        itemsCount={totalCount}
                        maxItemsPerPage={limit}
                        onActivePageChange={setPage}
                    />
                )}
                empty={!results?.length}
                emptyMessage="No Image Available"
            >
                <ListView
                    layout="grid"
                    numPreferredGridColumns={3}
                >
                    {results?.map((item, index) => (
                        <ImageComponent
                            key={item.id}
                            src={item.image.url}
                            name={item.image.name}
                            index={index}
                            onView={handleView}
                        />
                    ))}
                </ListView>
            </Container>
        </>
    );
}

export default Photos;
