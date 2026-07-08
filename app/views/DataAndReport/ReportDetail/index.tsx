import {
    useEffect,
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
} from '@togglecorp/fujs';
import { gql } from 'urql';

import PdfViewer from '#components/PdfViewer';
import PowerBIEmbed from '#components/PowerBiEmbed';
import {
    DocumentExtractionStatus,
    ExtractionType,
    ReportContentType,
    useReportQuery,
    useReportSummaryQuery,
} from '#generated/types/graphql';
import AIsummary from '#views/DataAndReport/AIsummary';

import styles from './styles.module.css';

const SUMMARY_POLL_INTERVAL = 10000;
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
    const { id } = props;

    const [{ fetching, data }] = useReportQuery({
        variables: { id: id! },
        pause: !id,
    });
    const reportData = data?.report;

    const [
        { fetching: summaryLoading, data: summaryData },
        refetchSummary,
    ] = useReportSummaryQuery({
        variables: {
            filters: {
                report: id,
                chunkType: ExtractionType.DocumentSummary,
            },
        },
        pause: !id || !reportData || reportData.contentType === ReportContentType.Iframe,
    });

    const summaryStatus = summaryData?.reportSummaries.results[0]?.status;

    const summaryPollCountRef = useRef(0);
    const [summaryPollTimedOut, setSummaryPollTimedOut] = useState(false);

    useEffect(() => {
        if (
            !summaryData?.reportSummaries.results.length
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
    }, [summaryData, summaryStatus, summaryPollTimedOut, refetchSummary]);

    const summaryResults = summaryData?.reportSummaries.results;

    const aiSummary = summaryResults
        ?.map((summary) => summary.text)
        .join('\n \n') ?? '';

    const showAiSummary = reportData?.contentType === ReportContentType.File
        && (summaryResults?.length ?? 0) > 0
        && summaryStatus !== DocumentExtractionStatus.Failure
        && !summaryPollTimedOut;

    const publishedAt = reportData?.publishedAt;
    const publishedDate = isDefined(publishedAt)
        ? encodeDate(new Date(publishedAt))
        : '-';

    const fileUrl = reportData?.file?.url;

    return (
        <PageContainer
            contentClassName={styles.pageContainer}
        >
            <Container
                pending={fetching}
            >
                <ListView
                    // ListView's props are a discriminated union: `withSidebar`
                    // is only allowed alongside layout="grid", so the variants
                    // have to be spread as complete objects.
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
                                <Heading
                                    level={3}
                                >
                                    {reportData?.title}
                                </Heading>
                                <Description>
                                    {reportData?.description}
                                </Description>
                            </ListView>
                        </ListView>
                        {isDefined(fileUrl)
                            ? <PdfViewer file={fileUrl} />
                            : (
                                <PowerBIEmbed
                                    embedUrl={reportData?.iframeUrl ?? ''}
                                />
                            )}
                    </ListView>
                    {showAiSummary && (
                        <div className={styles.details}>
                            <div className={styles.stickyDetails}>
                                <AIsummary
                                    summary={aiSummary}
                                    loading={summaryLoading
                                         || summaryStatus !== DocumentExtractionStatus.Success}
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
    const { id } = useParams<{ id: string }>();

    return (
        <ReportDetailContent
            key={id}
            id={id}
        />
    );
}

export default ReportDetail;
