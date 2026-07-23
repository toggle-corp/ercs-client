import {
    Container,
    ListView,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import DocumentCard from '#components/DocumentCard';
import Link from '#components/Link';
import Page from '#components/Page';
import {
    ReportTypeEnum,
    useDocumentListQuery,
} from '#generated/types/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DOCUMENT_LIST_QUERY = gql`
    query DocumentList(
        $pagination: OffsetPaginationInput,
        $filters: ReportFilter
    ) {
        reports(
            filters: $filters
            pagination: $pagination
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

interface Props {
    reportType: ReportTypeEnum
    heading: string;
    description: string;
}

function DocumentList(props: Props) {
    const {
        reportType,
        heading,
        description,
    } = props;

    const [{ data, fetching }] = useDocumentListQuery({
        variables: {
            filters: {
                reportType,
            },
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
                emptyMessage={`No documents found for the ${reportType.toLowerCase()}.`}
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
                                    src: document.coverImage?.url,
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
