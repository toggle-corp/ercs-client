import '@cyntler/react-doc-viewer/dist/index.css';

import { useMemo } from 'react';
import DocViewer, {
    DocViewerRenderers,
    type IConfig,
} from '@cyntler/react-doc-viewer';
import { ErrorWarningFillIcon } from '@ifrc-go/icons';
import { Message } from '@ifrc-go/ui';

import styles from './styles.module.css';

function NoRendererMessage() {
    return (
        <Message
            variant="error"
            icon={<ErrorWarningFillIcon />}
            title="Preview not available"
            description="This file type cannot be previewed. Please download the file to view it."
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

interface PdfViewerProps {
    file: string;
    fileName?: string;
}

function PdfViewer({
    file,
    fileName,
}: PdfViewerProps) {
    const documents = useMemo(
        () => [{ uri: file, fileName }],
        [file, fileName],
    );
    return (
        <div className={styles.pdfViewer}>
            <DocViewer
                documents={documents}
                pluginRenderers={DocViewerRenderers}
                config={viewerConfig}
            />
        </div>
    );
}

export default PdfViewer;
