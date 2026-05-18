import { useParams } from 'react-router';
import {
    Container,
    Description,
    Heading,
    InlineView,
    ListView,
    PageContainer,
} from '@ifrc-go/ui';
import { encodeDate } from '@togglecorp/fujs';
import { gql } from 'urql';

import PdfViewer from '#components/PdfViewer';
import PowerBIEmbed from '#components/PowerBiEmbed';
import { useReportQuery } from '#generated/types/graphql';
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

function ReportDetail() {
    const { id } = useParams<{ id: string }>();

    const [{ fetching, data }] = useReportQuery({
        variables: { id: id! },
        pause: !id,
    });

    const reportData = data?.report;

    // To do: add condition or ai summary
    const aiSummaryAvailable = !reportData?.iframeUrl;

    return (
        <PageContainer
            contentClassName={styles.pageContainer}
        >
            <Container
                pending={fetching}
            >
                <ListView
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...(aiSummaryAvailable ? { layout: 'grid', withSidebar: true } : { layout: 'block' })}
                >
                    <ListView
                        layout="block"
                        spacing={aiSummaryAvailable ? 'md' : 'xs'}
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
                                            {encodeDate(new Date(reportData?.publishedAt))}
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
                        {reportData?.file?.url
                            ? <PdfViewer file={reportData?.file?.url ?? ''} />
                            : (
                                <PowerBIEmbed embedUrl={reportData?.iframeUrl ?? ''} />
                            )}
                    </ListView>
                    {aiSummaryAvailable && (
                        <div className={styles.details}>
                            <div className={styles.stickyDetails}>
                                <AIsummary />
                            </div>
                        </div>
                    )}
                </ListView>
            </Container>
        </PageContainer>
    );
}

export default ReportDetail;
