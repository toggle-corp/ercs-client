import { useCallback } from 'react';
import { DownloadTwoFillIcon } from '@ifrc-go/icons';
import {
    IconButton,
    Image,
    RawButton,
} from '@ifrc-go/ui';
import { isTruthyString } from '@togglecorp/fujs';
import { saveAs } from 'file-saver';

import styles from './styles.module.css';

interface Props {
    index: number;
    url: string;
    name: string;
    caption: string | undefined | null;
    totalCount: number;
    onViewClick: (index: number) => void;
}

function PhotoTile(props: Props) {
    const {
        index,
        url,
        name,
        caption,
        totalCount,
        onViewClick,
    } = props;

    const label = isTruthyString(caption)
        ? caption
        : `photo ${index + 1} of ${totalCount}`;

    const handleDownloadClick = useCallback(
        () => {
            saveAs(url, name);
        },
        [url, name],
    );

    return (
        <div className={styles.photoTile}>
            <RawButton
                name={index}
                onClick={onViewClick}
                className={styles.viewButton}
                aria-label={`open ${label}`}
            >
                <Image
                    src={url}
                    alt={label}
                    className={styles.image}
                    imgElementClassName={styles.imageElement}
                    withoutCaption
                />
            </RawButton>
            <IconButton
                name="download"
                className={styles.downloadButton}
                ariaLabel={`download ${label}`}
                title="download"
                round={false}
                variant="secondary"
                onClick={handleDownloadClick}
            >
                <DownloadTwoFillIcon />
            </IconButton>
        </div>
    );
}

export default PhotoTile;
