import React from 'react';
import {
    DownloadTwoFillIcon,
    EyeFillIcon,
} from '@ifrc-go/icons';
import {
    Container,
    IconButton,
    Image,
    ListView,
    Pager,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import { useGalleryQuery } from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IMAGES_QUERY = gql`
    query Gallery($offset: Int, $limit: Int, $albumId: ID) {
        galleryImages(
            pagination: { limit: $limit, offset: $offset }
            filters: { albumId: $albumId }
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

interface ImageComponentProps {
    src: string;
    name: string;
    onView: (src: string) => void;
}

function ImageComponent(props: ImageComponentProps) {
    const {
        src, name,
        onView,
    } = props;
    const safeSrc = toSafeSrc(src);

    return (
        <div className={styles.imgContainer}>
            <Image src={safeSrc} size="md" />
            <ListView
                spacing="3xs"
                className={styles.actionButton}
                withPadding
            >
                <a href={safeSrc} download={name}>
                    <IconButton
                        name="download"
                        ariaLabel="download"
                        title="download"
                        round={false}
                        variant="secondary"
                    >
                        <DownloadTwoFillIcon />
                    </IconButton>
                </a>
                <IconButton
                    name={safeSrc}
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

function Photos(props: {albumId: string, handleView: (src:string) => void}) {
    const { albumId, handleView } = props;
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
            albumId,
            limit,
            offset,
        },
    });
    return (
        <Container
            pending={imageLoading}
            footerActions={(
                <Pager
                    activePage={page}
                    itemsCount={imageData?.galleryImages?.totalCount ?? 0}
                    maxItemsPerPage={limit}
                    onActivePageChange={setPage}
                />
            )}
            empty={!imageData?.galleryImages.results.length}
            emptyMessage="No Image Available"
        >
            <ListView
                layout="grid"
                numPreferredGridColumns={3}
            >
                {imageData?.galleryImages.results.map((item) => (
                    <ImageComponent
                        key={item.image.name}
                        src={item.image.url}
                        name={item.image.name}
                        onView={handleView}
                    />
                ))}
            </ListView>
        </Container>
    );
}

export default Photos;
