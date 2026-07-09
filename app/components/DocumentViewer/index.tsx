import '@cyntler/react-doc-viewer/dist/index.css';

import { useMemo } from 'react';
import DocViewer, {
    DocViewerRenderers,
    type IConfig,
} from '@cyntler/react-doc-viewer';
import { ErrorWarningFillIcon } from '@ifrc-go/icons';
import { Message } from '@ifrc-go/ui';

import useAuth from '#hooks/useAuth';

import styles from './styles.module.css';

function NoRendererMessage() {
    const { isAuthenticated } = useAuth();
    return (
        <Message
            className={styles.noRendererMessage}
            variant="error"
            icon={<ErrorWarningFillIcon />}
            title="Preview not available"
            description={`This file type cannot be previewed. ${isAuthenticated ? 'Please download the file to view it.' : ''}`}
        />
    );
}

const viewerConfig: IConfig = {
    header: {
        disableHeader: true,
        disableFileName: true,
    },
    pdfVerticalScrollByDefault: true,
    noRenderer: {
        overrideComponent: NoRendererMessage,
    },
};

interface DocumentViewerProps {
    fileUrl: string;
    fileName?: string;
}

function DocumentViewer({
    fileUrl,
    fileName,
}: DocumentViewerProps) {
    const documents = useMemo(
        () => [{ uri: fileUrl, fileName }],
        [fileUrl, fileName],
    );
    return (
        <div className={styles.DocumentViewer}>
            <DocViewer
                documents={documents}
                pluginRenderers={DocViewerRenderers}
                config={viewerConfig}
            />
        </div>
    );
}

export default DocumentViewer;
