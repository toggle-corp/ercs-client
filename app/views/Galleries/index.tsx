import {
    useEffect,
    useState,
} from 'react';
import {
    DownloadTwoFillIcon,
    EyeFillIcon,
} from '@ifrc-go/icons';
import {
    Container,
    Description,
    Heading,
    IconButton,
    Image,
    ListView,
    Modal,
    NavigationTabList,
    TabLayout,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import Page from '#components/Page';
import {
    useAlbumsQuery,
    useGalleryQuery,
} from '#generated/types/graphql';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ALBUM_QUERY = gql`
  query Albums {
    galleryAlbums {
      results {
        id
        title
      }
      totalCount
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IMAGES_QUERY = gql`
  query Gallery($pk: ID!) {
    galleryAlbum(pk: $pk) {
      images {
        image {
          name
          size
          url
        }
      }
    }
  }
`;

const toSafeSrc = (src: string) => (src.startsWith('http')
    ? src.replace(/^http:\/\/web:8000/, 'http://localhost:8000')
    : src);

interface ImageComponentProps {
  src: string;
  name: string;
  onView: (src: string) => void;
}

interface ImageViewerProps {
  src: string;
  onClose: () => void;
}

function ImageComponent({ src, name, onView }: ImageComponentProps) {
    const safeSrc = toSafeSrc(src);
    return (
        <div className={styles.imgContainer}>
            <Image src={safeSrc} size="md" />
            <ListView spacing="3xs" className={styles.actionButton} withPadding>
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

function ImageViewer({ src, onClose }: ImageViewerProps) {
    return (
        <Modal
            closeOnClickOutside
            closeOnEscape
            onClose={onClose}
            size="lg"
            heading="Image Viewer"
            headingLevel={4}
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

function Galleries() {
    const [activeId, setActiveId] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [viewerOpen, setViewerOpen] = useState(false);

    const [{ data }] = useAlbumsQuery();
    const [{ fetching: imageLoading, data: imageData }] = useGalleryQuery({
        variables: { pk: activeId! },
        pause: !activeId,
    });

    const handleView = (src: string) => {
        setSelectedImage(src);
        setViewerOpen(true);
    };

    useEffect(() => {
        if (data?.galleryAlbums?.results?.length && !activeId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveId(data?.galleryAlbums.results[0].id);
        }
    }, [data, activeId]);

    return (
        <Page
            heading="Galleries"
            description="Capturing moments of service, resilience, and community impact."
            info={(
                <ListView withCenteredContents>
                    <Description>
                        <i>
                            {data?.galleryAlbums.totalCount}
                            {' '}
                            Events • 85 Photos
                        </i>
                    </Description>
                </ListView>
            )}
        >
            <ListView layout="block" spacing="xs">
                {viewerOpen && (
                    <ImageViewer
                        src={selectedImage}
                        onClose={() => setViewerOpen(false)}
                    />
                )}
                <Heading level={4}>Event</Heading>
                <ListView layout="grid" withSidebar sidebarPosition="start">
                    <NavigationTabList styleVariant="vertical">
                        {data?.galleryAlbums.results.map((item) => (
                            <TabLayout
                                key={item.id}
                                styleVariant="vertical"
                                active={activeId.includes(item.id)}
                                onClickCapture={() => setActiveId(item.id)}
                            >
                                {item.title}
                            </TabLayout>
                        ))}
                    </NavigationTabList>
                    <Container
                        pending={imageLoading}
                    >
                        <ListView layout="grid" numPreferredGridColumns={3}>
                            {imageData?.galleryAlbum.images.map((item) => (
                                <ImageComponent
                                    key={item.image.name}
                                    src={item.image.url}
                                    name={item.image.name}
                                    onView={handleView}
                                />
                            ))}
                        </ListView>
                    </Container>
                </ListView>
            </ListView>
        </Page>
    );
}

export default Galleries;
