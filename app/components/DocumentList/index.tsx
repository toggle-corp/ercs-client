import {
    Container,
    ListView,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import DocumentCard from '#components/DocumentCard';
import Link from '#components/Link';
import Page from '#components/Page';
import {
    useDocumentListQuery,
    useReportEnumsQuery,
} from '#generated/types/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DOCUMENT_LIST_QUERY = gql`
    query DocumentList(
        $reportType: String
        $limit: Int = 10
        $offset: Int = 0
    ) {
        reports(
            filters: { reportType: $reportType }
            pagination: { limit: $limit, offset: $offset }
        ) {
            totalCount
            results {
                id
                title
                description
                visibility
                file {
                    url
                }
                coverImage {
                    url
                }
            }
        }
    }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const REPORT_ENUMS_QUERY = gql`
    query ReportEnums {
        enums {
            ReportType {
                label
                key
                value
            }
        }
    }
`;

interface Props {
    reportType: 'REPORT' | 'MANUAL' | 'POLICY' | 'GUIDELINE' | 'ONLINE_INTERACTIVE';
    heading: string;
    description: string;
}

function DocumentList(props: Props) {
    const [{ data: reportTypeEnum }] = useReportEnumsQuery();
    const {
        reportType,
        heading,
        description,
    } = props;

    const reportTypeValue = reportTypeEnum?.enums.ReportType?.find(
        (item) => item.key === reportType,
    )?.value ?? 0;

    const [{ data, fetching }] = useDocumentListQuery({
        variables: {
            reportType: String(reportTypeValue),
        },
    });

    return (
        <Page
            heading={heading}
            description={description}
        >
            <Container
                pending={fetching}
                empty={data?.reports.totalCount === 0}
            >
                <ListView
                    layout="grid"
                    numPreferredGridColumns={5}
                >
                    {data?.reports.results.map((document) => (
                        <Link
                            key={document.id}
                            href={document.file?.url}
                            external
                            withFullWidth
                        >
                            <DocumentCard
                                manual={{
                                    title: document.title,
                                    src: document.coverImage?.url ?? '',
                                }}
                            />
                        </Link>
                    ))}
                </ListView>
            </Container>
        </Page>
    );
}

export default DocumentList;
