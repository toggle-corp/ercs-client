import {
    Chip,
    Container,
    DateOutput,
    ListView,
    Message,
    Modal,
    TextOutput,
} from '@ifrc-go/ui';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import { isDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import {
    type KoboFieldReportQuery,
    useKoboFieldReportQuery,
} from '#generated/types/graphql';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const KOBO_FIELD_REPORT_QUERY = gql`
    query KoboFieldReport($id: ID!) {
        koboFieldReport(id: $id) {
            id
            index
            title
            emergencyCode
            submissionTime
            reportingBranch
            region
            location
            reportingPeriodStart
            reportingPeriodEnd
            reportingDays
            peopleReached
            volunteers
            staff
            bdrt
            typeOfReportedInformation
            prepositionedStocksUsed
            responseActions
            latestDevelopments
        }
    }
`;

type FieldReport = NonNullable<KoboFieldReportQuery['koboFieldReport']>;

interface Props {
    id: string;
    onClose: () => void;
}

function FieldReportModal(props: Props) {
    const { id, onClose } = props;

    const [{ data, fetching }] = useKoboFieldReportQuery({
        variables: { id },
    });
    const report: FieldReport | null | undefined = data?.koboFieldReport;

    const reportingPeriod = report && isDefined(report.reportingPeriodStart)
        ? [report.reportingPeriodStart, report.reportingPeriodEnd].filter(isDefined).join(' → ')
        : undefined;

    const headerDescription = report && (
        <ListView
            layout="block"
            spacing="3xs"
        >
            <span className={styles.pretitle}>
                Emergency Field Report · ERCS EOC
            </span>
            <span className={styles.breadcrumb}>
                {[report.emergencyCode, `FR-${report.index}`].filter(isDefined).join(' / ')}
            </span>
            {isDefined(report.submissionTime) && (
                <span className={styles.submitted}>
                    {resolveToComponent(
                        'Submitted {date}{period}{days}{branch}',
                        {
                            date: <DateOutput value={report.submissionTime} />,
                            period: reportingPeriod ? ` · reporting period ${reportingPeriod}` : '',
                            days: isDefined(report.reportingDays) ? ` (${report.reportingDays} days)` : '',
                            branch: report.reportingBranch ? ` · ${report.reportingBranch} branch` : '',
                        },
                    )}
                </span>
            )}
        </ListView>
    );

    return (
        <Modal
            heading={report?.title ?? 'Field Report'}
            headerDescription={headerDescription}
            headingLevel={2}
            onClose={onClose}
            size="lg"
            pending={fetching}
            spacing="lg"
        >
            {!fetching && !report && (
                <Message
                    title="Field report not available"
                    description="This field report could not be loaded."
                />
            )}
            {report && (
                <ListView
                    layout="block"
                    spacing="lg"
                >
                    <ListView
                        layout="grid"
                        numPreferredGridColumns={4}
                    >
                        <TextOutput
                            label="Total people reached"
                            value={report.peopleReached}
                            valueType="number"
                            textSize="lg"
                            strongValue
                            withBlockLayout
                            withBackground
                        />
                        <TextOutput
                            label="Volunteers engaged"
                            value={report.volunteers}
                            valueType="number"
                            textSize="lg"
                            strongValue
                            withBlockLayout
                            withBackground
                        />
                        <TextOutput
                            label="Paid staff engaged"
                            value={report.staff}
                            valueType="number"
                            textSize="lg"
                            strongValue
                            withBlockLayout
                            withBackground
                        />
                        <TextOutput
                            label="BDRT members deployed"
                            value={report.bdrt}
                            valueType="number"
                            textSize="lg"
                            strongValue
                            withBlockLayout
                            withBackground
                        />
                    </ListView>

                    <Container
                        heading="Report details"
                        headingLevel={5}
                        withHeaderBorder
                        spacing="sm"
                    >
                        <ListView
                            layout="grid"
                            numPreferredGridColumns={3}
                        >
                            <TextOutput label="Related emergency" value={report.emergencyCode} valueType="text" withBlockLayout />
                            <TextOutput label="Type of reported information" value={report.typeOfReportedInformation} valueType="text" withBlockLayout />
                            <TextOutput label="Reporting ERCS branch" value={report.reportingBranch} valueType="text" withBlockLayout />
                            <TextOutput label="Location" value={report.location} valueType="text" withBlockLayout />
                            <TextOutput label="Reporting period" value={reportingPeriod} valueType="text" withBlockLayout />
                            <TextOutput label="Prepositioned stocks used" value={report.prepositionedStocksUsed} valueType="text" withBlockLayout />
                        </ListView>
                    </Container>

                    {report.responseActions.length > 0 && (
                        <Container
                            heading="Response actions undertaken"
                            headingLevel={5}
                            withHeaderBorder
                            spacing="sm"
                        >
                            <div className={styles.chips}>
                                {report.responseActions.map((action) => (
                                    <Chip
                                        key={action}
                                        name={action}
                                        label={action}
                                        variant="tertiary"
                                    />
                                ))}
                            </div>
                        </Container>
                    )}

                    {isDefined(report.latestDevelopments) && (
                        <Container
                            heading="Latest developments"
                            headingLevel={5}
                            withHeaderBorder
                            spacing="sm"
                        >
                            <div className={styles.developments}>
                                {report.latestDevelopments}
                            </div>
                        </Container>
                    )}
                </ListView>
            )}
        </Modal>
    );
}

export default FieldReportModal;
