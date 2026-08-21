import { LayoutGridLineIcon } from '@ifrc-go/icons';
import {
    Description,
    Heading,
    Image,
    ListView,
} from '@ifrc-go/ui';
import { isTruthyString } from '@togglecorp/fujs';

import Link from '#components/Link';
import toSafeMediaUrl from '#utils/gallery';

import styles from './styles.module.css';

interface Props {
    albumId: string;
    title: string;
    imagesCount: number;
    coverImageUrl: string | undefined | null;
}

function AlbumCard(props: Props) {
    const {
        albumId,
        title,
        imagesCount,
        coverImageUrl,
    } = props;

    return (
        <Link
            to="galleryAlbum"
            attrs={{ id: albumId }}
            withFullWidth
            withoutPadding
        >
            <ListView
                layout="block"
                spacing="2xs"
                className={styles.albumCard}
            >
                <div className={styles.cover}>
                    {isTruthyString(coverImageUrl) ? (
                        <Image
                            src={toSafeMediaUrl(coverImageUrl)}
                            size="md"
                            withoutCaption
                        />
                    ) : (
                        <ListView
                            withCenteredContents
                            className={styles.coverPlaceholder}
                        >
                            <LayoutGridLineIcon className={styles.coverPlaceholderIcon} />
                        </ListView>
                    )}
                    <Description
                        className={styles.imagesCount}
                        textSize="sm"
                    >
                        {imagesCount === 1 ? '1 photo' : `${imagesCount} photos`}
                    </Description>
                </div>
                <Heading
                    level={5}
                    className={styles.title}
                >
                    {title}
                </Heading>
            </ListView>
        </Link>
    );
}

export default AlbumCard;
