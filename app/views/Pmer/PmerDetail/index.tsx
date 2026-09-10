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
    isTruthyString,
} from '@togglecorp/fujs';
import { gql } from 'urql';

import DocumentViewer from '#components/DocumentViewer';
import FileDownloadButton from '#components/FileDownloadButton';
import PreloadMessage from '#components/PreloadMessage';
import { usePmerReportQuery } from '#generated/types/graphql';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PMER_REPORT_QUERY = gql`
    query PmerReport($id: ID!) {
        pmerReport(id: $id) {
            id
            title
            description
            category
            categoryDisplay
            reportType
            reportTypeDisplay
            department
            project
            visibility
            createdAt
            createdBy {
                id
                fullName
            }
            region {
                id
                name
            }
            file {
                name
                size
                url
            }
        }
    }
`;

interface Props {
    id: string;
}

function PmerDetailContent(props: Props) {
    const { id: pmerReportId } = props;

    const [{ fetching, data, error }] = usePmerReportQuery({
        variables: { id: pmerReportId },
    });
    const pmerReport = data?.pmerReport;

    const publishedDate = isDefined(pmerReport?.createdAt)
        ? encodeDate(new Date(pmerReport?.createdAt))
        : '-';

    const createdBy = pmerReport?.createdBy?.fullName;

    const fileUrl = pmerReport?.file?.url;
    const fileName = pmerReport?.file?.name;

    return (
        <PageContainer>
            <Container
                pending={fetching}
                withPadding
                errored={isDefined(error)}
                errorMessage="Failed to load the PMER document. Please try again later."
            >
                <ListView
                    layout="block"
                >
                    <ListView
                        layout="block"
                        spacing="xs"
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
                                            {isTruthyString(createdBy) ? createdBy : 'Anonymous'}
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
                                        {pmerReport?.title}
                                    </Heading>
                                    <FileDownloadButton
                                        fileUrl={fileUrl}
                                        fileName={fileName}
                                    />
                                </ListView>
                                <Description
                                    withLightText
                                >
                                    {[
                                        pmerReport?.reportTypeDisplay,
                                        pmerReport?.categoryDisplay,
                                        pmerReport?.region?.name,
                                        pmerReport?.department,
                                        pmerReport?.project,
                                    ].filter(isTruthyString).join(' • ')}
                                </Description>
                                <Description>
                                    {pmerReport?.description}
                                </Description>
                            </ListView>
                        </ListView>
                        {isDefined(fileUrl) && (
                            <DocumentViewer
                                fileUrl={fileUrl}
                                fileName={fileName ?? undefined}
                            />
                        )}
                    </ListView>
                </ListView>
            </Container>
        </PageContainer>
    );
}

function PmerDetail() {
    const { id } = useParams<{ id: string | undefined }>();

    if (isNotDefined(id)) {
        return (
            <PreloadMessage>
                PMER document not found.
            </PreloadMessage>
        );
    }

    return (
        <PmerDetailContent
            key={id}
            id={id}
        />
    );
}

export default PmerDetail;
