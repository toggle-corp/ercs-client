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
        $pagination: OffsetPaginationInput,
        $filters: ReportSummaryFilter
    ) {
        reportSummaries(
            filters: $filters
            pagination: $pagination
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
            pageInfo {
                offset
                limit
            }
        }
    }
`;

function ReportDetail() {
    const { id } = useParams<{ id: string }>();

    const [{ fetching, data }] = useReportQuery({
        variables: { id: id! },
        pause: !id,
    });
    const reportData = data?.report;

    const [{ fetching: summaryLoading, data: summaryData }] = useReportSummaryQuery({
        variables: {
            filters: {
                report: id,
                status: DocumentExtractionStatus.Success,
                chunkType: ExtractionType.DocumentSummary,
            },
        },
        pause: !id || !reportData || reportData.contentType === ReportContentType.Iframe,
    });

    const aiSummary = summaryData?.reportSummaries.results
        .map((summary) => summary.text)
        .join('\n \n');
    const publishedDate = new Date(reportData?.publishedAt);
    const encodedPublishedDate = encodeDate(publishedDate);

    return (
        <PageContainer
            contentClassName={styles.pageContainer}
        >
            <Container
                pending={fetching}
            >
                <ListView
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...(isDefined(aiSummary)
                        ? { layout: 'grid', withSidebar: true }
                        : { layout: 'block' })}
                >
                    <ListView
                        layout="block"
                        spacing={aiSummary ? 'md' : 'xs'}
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
                                            {encodedPublishedDate}
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
                        {isDefined(reportData?.file?.url)
                            ? <PdfViewer file={reportData?.file?.url ?? ''} />
                            : (
                                <PowerBIEmbed
                                    embedUrl={reportData?.iframeUrl ?? ''}
                                />
                            ) }
                    </ListView>
                    {isDefined(aiSummary) && (
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

export default ReportDetail;
