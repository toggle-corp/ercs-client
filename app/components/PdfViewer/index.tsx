import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import {
    useCallback,
    useState,
} from 'react';
import {
    Document,
    Page as PdfPage,
    pdfjs,
} from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    file: string;
    loadingMessage?: React.ReactNode;
    errorMessage?: React.ReactNode;
}

function PdfViewer({
    file,
    loadingMessage = <p>Loading PDF…</p>,
    errorMessage = <p>Failed to load PDF.</p>,
}: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [loadedPages, setLoadedPages] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>();

    const allPagesLoaded = numPages > 0 && loadedPages === numPages;
    const onContainerRef = useCallback((node: HTMLDivElement | null): void => {
        if (node) {
            setContainerWidth(node.getBoundingClientRect().width);
        }
    }, []);

    const onDocumentLoadSuccess = useCallback(
        ({ numPages: nextNumPages }: { numPages: number }): void => {
            setNumPages(nextNumPages);
        },
        [],
    );

    const onPageLoadSuccess = useCallback((): void => {
        setLoadedPages((prev) => prev + 1);
    }, []);
    return (
        <div
            ref={onContainerRef}
            style={{ width: '100%' }}
        >
            {!allPagesLoaded && loadingMessage}
            <div
                style={{ display: allPagesLoaded ? 'block' : 'none' }}
            >
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    error={errorMessage}
                >
                    {Array.from({ length: numPages }, (_, index) => (
                        <PdfPage
                            key={index + 1}
                            pageNumber={index + 1}
                            width={containerWidth}
                            onLoadSuccess={onPageLoadSuccess}
                        />
                    ))}
                </Document>
            </div>
        </div>
    );
}

export default PdfViewer;
