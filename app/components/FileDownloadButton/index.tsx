import { useCallback } from 'react';
import { DownloadTwoFillIcon } from '@ifrc-go/icons';
import { Button } from '@ifrc-go/ui';
import { isNotDefined } from '@togglecorp/fujs';
import { saveAs } from 'file-saver';

import useAuth from '#hooks/useAuth';

import styles from './styles.module.css';

interface Props {
    fileUrl: string | undefined | null;
    fileName?: string | undefined | null;
}

function FileDownloadButton(props: Props) {
    const {
        fileUrl,
        fileName,
    } = props;

    const { isAuthenticated } = useAuth();

    const handleDownloadClick = useCallback(() => {
        if (isNotDefined(fileUrl)) {
            return;
        }
        const urlName = fileUrl.split('/').pop()?.split('?')[0]?.replace(/\.[^/.]+$/, '');
        saveAs(fileUrl, fileName ?? urlName);
    }, [fileUrl, fileName]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Button
            name="download"
            title="Download"
            className={styles.fileDownloadButton}
            onClick={handleDownloadClick}
            styleVariant="action"
        >
            <DownloadTwoFillIcon />
        </Button>
    );
}

export default FileDownloadButton;
