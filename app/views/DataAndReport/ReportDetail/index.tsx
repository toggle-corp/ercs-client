import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useParams } from 'react-router';
import {
    Container,
    Description,
    Heading,
    InlineView,
    ListView,
    PageContainer,
} from '@ifrc-go/ui';
import {
    encodeDate,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import { gql } from 'urql';

import DocumentViewer from '#components/DocumentViewer';
import FileDownloadButton from '#components/FileDownloadButton';
import PowerBIEmbed from '#components/PowerBiEmbed';
import PreloadMessage from '#components/PreloadMessage';
import {
    DocumentExtractionStatus,
    ExtractionType,
    ReportContentType,
    useReportQuery,
    useReportSummaryQuery,
} from '#generated/types/graphql';
import AIsummary from '#views/DataAndReport/AIsummary';

import styles from './styles.module.css';

const SUMMARY_POLL_INTERVAL = 1000 * 60;
const MAX_SUMMARY_POLL_COUNT = 30;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const REPORT_QUERY = gql`
    query Report($id: ID!) {
        report(id: $id) {
            contentType
            description
            disasterType
            file {
                name
                size
                url
            }
            publishedAt
            owner
            iframeUrl
            id
            title
            regionId
        }
    }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const REPORT_SUMMARY_QUERY = gql`
    query ReportSummary(
        $filters: ReportSummaryFilter
    ) {
        reportSummaries(
            filters: $filters
        ) {
            totalCount
            results {
                id
                chunkType
                text
                pageNumber
                status
            }
            totalCount
        }
    }
`;

interface Props {
    id: string | undefined;
}

function ReportDetailContent(props: Props) {
    const { id: reportId } = props;
    const summaryPollCountRef = useRef(0);
    const [summaryPollTimedOut, setSummaryPollTimedOut] = useState(false);

    const [{ fetching, data, error }] = useReportQuery({
        variables: { id: reportId! },
        pause: !reportId,
    });
    const reportData = data?.report;

    const [
        { fetching: summaryLoading, data: summaryData },
        refetchSummary,
    ] = useReportSummaryQuery({
        variables: {
            filters: {
                report: reportId,
                chunkType: ExtractionType.DocumentSummary,
            },
        },
        pause: !reportId || !reportData || reportData.contentType === ReportContentType.Iframe,
    });

    const summaryResults = useMemo(
        () => summaryData?.reportSummaries.results ?? [],
        [summaryData?.reportSummaries.results],
    );
    const summaryStatus = summaryResults[0]?.status;

    const aiSummary = summaryResults
        ?.map((summary) => summary.text)
        .join('\n \n') ?? '';

    const showAiSummary = reportData?.contentType === ReportContentType.File
        && (summaryResults?.length ?? 0) > 0
        && summaryStatus !== DocumentExtractionStatus.Failure
        && !summaryPollTimedOut;

    const publishedDate = isDefined(reportData?.publishedAt)
        ? encodeDate(new Date(reportData?.publishedAt))
        : '-';

    const fileUrl = reportData?.file?.url;
    const fileName = reportData?.file?.name;

    useEffect(() => {
        if (
            summaryResults.length === 0
            || summaryStatus === DocumentExtractionStatus.Success
            || summaryStatus === DocumentExtractionStatus.Failure
            || summaryPollTimedOut
        ) {
            return undefined;
        }

        const timeout = window.setTimeout(() => {
            if (summaryPollCountRef.current >= MAX_SUMMARY_POLL_COUNT) {
                setSummaryPollTimedOut(true);
                return;
            }
            summaryPollCountRef.current += 1;
            refetchSummary({ requestPolicy: 'network-only' });
        }, SUMMARY_POLL_INTERVAL);

        return () => window.clearTimeout(timeout);
    }, [summaryResults, summaryStatus, summaryPollTimedOut, refetchSummary]);

    return (
        <PageContainer>
            <Container
                pending={fetching}
                withPadding
                errored={isDefined(error)}
                errorMessage="Failed to load the report. Please try again later."
            >
                <ListView
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...(showAiSummary
                        ? { layout: 'grid', withSidebar: true }
                        : { layout: 'block' })}
                >
                    <ListView
                        layout="block"
                        spacing={showAiSummary ? 'md' : 'xs'}
                        className={styles.content}
                    >
                        <ListView
                            layout="block"
                        >
                            <InlineView
                                before={(
                                    <ListView
                                        spacing="4xs"
                                    >
                                        <Description
                                            withLightText
                                        >
                                            Published Date:
                                        </Description>
                                        <Description>
                                            {publishedDate}
                                        </Description>
                                    </ListView>
                                )}
                                after={(
                                    <ListView spacing="4xs">
                                        <Description
                                            withLightText
                                        >
                                            Published By:
                                        </Description>
                                        <Description>
                                            {reportData?.owner ?? 'Anonymous'}
                                        </Description>
                                    </ListView>
                                )}
                            />
                            <ListView
                                layout="block"
                                spacing="xs"
                            >
                                <ListView withSpaceBetweenContents>
                                    <Heading
                                        level={3}
                                    >
                                        {reportData?.title}
                                    </Heading>
                                    <FileDownloadButton
                                        fileUrl={fileUrl}
                                        fileName={fileName}
                                    />
                                </ListView>
                                <Description>
                                    {reportData?.description}
                                </Description>
                            </ListView>
                        </ListView>
                        {reportData?.contentType === ReportContentType.File
                            && isDefined(fileUrl) && (
                            <DocumentViewer
                                fileUrl={fileUrl}
                                fileName={fileName ?? undefined}
                            />
                        )}
                        {reportData?.contentType === ReportContentType.Iframe
                            && isDefined(reportData?.iframeUrl) && (
                            <PowerBIEmbed
                                embedUrl={reportData.iframeUrl}
                            />
                        )}
                    </ListView>
                    {showAiSummary && (
                        <div className={styles.details}>
                            <div className={styles.stickyDetails}>
                                <AIsummary
                                    summary={aiSummary}
                                    loading={summaryLoading}
                                />
                            </div>
                        </div>
                    )}
                </ListView>
            </Container>
        </PageContainer>
    );
}

function ReportDetail() {
    const { id } = useParams<{ id: string | undefined }>();

    if (isNotDefined(id)) {
        return (
            <PreloadMessage>
                Report not found.
            </PreloadMessage>
        );
    }

    return (
        <ReportDetailContent
            key={id}
            id={id}
        />
    );
}

export default ReportDetail;
