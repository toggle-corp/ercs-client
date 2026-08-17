import {
    useCallback,
    useEffect,
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
import { isDefined } from '@togglecorp/fujs';
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
                albumId
                caption
                id
                image {
                    name
                    size
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
    images: string[];
    index: number;
    page: number;
    totalPages: number;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}

function ImageViewer(props: ImageViewerProps) {
    const {
        images,
        index,
        page,
        totalPages,
        onIndexChange,
        onClose,
    } = props;

    const hasPrev = index > 0;
    const hasNext = index < images.length - 1;

    useEffect(() => {
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
    }, [index, images.length, onIndexChange]);

    const src = images[index];

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
            footer={`${index + 1} / ${images.length} · Page ${page} of ${totalPages}`}
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

function Photos(props: {albumId: string}) {
    const { albumId } = props;
    const [activeIndex, setActiveIndex] = useState<number>();
    const {
        limit,
        page,
        setPage,
        offset,
    } = useFilterState({
        filter: {},
        pageSize: 9,
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
    const images = results?.map((item) => toSafeSrc(item.image.url)) ?? [];
    const totalCount = imageData?.galleryImages?.totalCount ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const activeSrc = isDefined(activeIndex) ? images[activeIndex] : undefined;

    const handleViewerClose = useCallback(() => {
        setActiveIndex(undefined);
    }, []);

    return (
        <>
            {isDefined(activeIndex) && isDefined(activeSrc) && (
                <ImageViewer
                    images={images}
                    index={activeIndex}
                    page={page}
                    totalPages={totalPages}
                    onIndexChange={setActiveIndex}
                    onClose={handleViewerClose}
                />
            )}
            <Container
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
                            key={item.image.name}
                            src={item.image.url}
                            name={item.image.name}
                            index={index}
                            onView={setActiveIndex}
                        />
                    ))}
                </ListView>
            </Container>
        </>
    );
}

export default Photos;
