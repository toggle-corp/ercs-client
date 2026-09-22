import {
    useCallback,
    useState,
} from 'react';
import {
    Button,
    Container,
    DateOutput,
    ListView,
    Message,
    Modal,
    Table,
    TextOutput,
} from '@ifrc-go/ui';
import {
    createDateColumn,
    createElementColumn,
    createNumberColumn,
    resolveToComponent,
} from '@ifrc-go/ui/utils';
import { isDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import {
    type KoboEmergencyQuery,
    useKoboEmergencyQuery,
} from '#generated/types/graphql';
import FieldReportModal from '#views/Home/FieldReportModal';
import RapidNeedsModal from '#views/Home/RapidNeedsModal';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const KOBO_EMERGENCY_QUERY = gql`
    query KoboEmergency($id: ID!) {
        koboEmergency(id: $id) {
            id
            koboId
            emergencyCode
            title
            hazard
            alertType
            submissionTime
            reportingBranch
            region
            zone
            woreda
            kebele
            locationScope
            onsetDate
            generalDescription
            populationInAffectedArea
            peopleAffected
            peopleDisplaced
            latitude
            longitude
            rapidNeeds {
                id
                submissionTime
                label
                value
            }
            fieldReports {
                id
                submissionTime
                label
                value
            }
        }
    }
`;

type EmergencyDetail = NonNullable<KoboEmergencyQuery['koboEmergency']>;
type RelatedReport = EmergencyDetail['rapidNeeds'][number];

const relatedReportKeySelector = (item: RelatedReport) => item.id;

interface ReportLinkButtonProps {
    id: string;
    label: string;
    onClick: (id: string) => void;
}

function ReportLinkButton(props: ReportLinkButtonProps) {
    const { id, label, onClick } = props;
    return (
        <Button
            name={id}
            onClick={onClick}
            styleVariant="transparent"
        >
            {label}
        </Button>
    );
}

interface Props {
    id: string;
    onClose: () => void;
}

function EmergencyDetailModal(props: Props) {
    const { id, onClose } = props;

    const [{ data, fetching }] = useKoboEmergencyQuery({
        variables: { id },
    });
    const emergency = data?.koboEmergency;

    const [activeRnaId, setActiveRnaId] = useState<string | undefined>();
    const [activeFieldReportId, setActiveFieldReportId] = useState<string | undefined>();

    const handleRnaModalClose = useCallback(() => {
        setActiveRnaId(undefined);
    }, []);

    const handleFieldReportModalClose = useCallback(() => {
        setActiveFieldReportId(undefined);
    }, []);

    const rapidNeedsColumns = [
        createDateColumn<RelatedReport, string>(
            'submissionTime',
            'Submission date',
            (item) => item.submissionTime,
        ),
        createElementColumn<RelatedReport, string, ReportLinkButtonProps>(
            'label',
            'Assessment',
            ReportLinkButton,
            (_, item) => ({ id: item.id, label: item.label, onClick: setActiveRnaId }),
        ),
        createNumberColumn<RelatedReport, string>(
            'value',
            'People in need',
            (item) => item.value,
        ),
    ];

    const fieldReportColumns = [
        createDateColumn<RelatedReport, string>(
            'submissionTime',
            'Submission date',
            (item) => item.submissionTime,
        ),
        createElementColumn<RelatedReport, string, ReportLinkButtonProps>(
            'label',
            'Field report',
            ReportLinkButton,
            (_, item) => ({ id: item.id, label: item.label, onClick: setActiveFieldReportId }),
        ),
        createNumberColumn<RelatedReport, string>(
            'value',
            'People reached',
            (item) => item.value,
        ),
    ];

    const heading = emergency?.title ?? emergency?.emergencyCode ?? 'Emergency alert';

    const headerDescription = emergency && (
        <ListView
            layout="block"
            spacing="3xs"
        >
            <ListView
                spacing="xs"
                withWrap
            >
                {isDefined(emergency.hazard) && (
                    <span className={styles.hazardBadge}>
                        {emergency.hazard}
                    </span>
                )}
                {isDefined(emergency.emergencyCode) && (
                    <span className={styles.code}>
                        {emergency.emergencyCode}
                    </span>
                )}
            </ListView>
            {isDefined(emergency.submissionTime) && (
                <span className={styles.submitted}>
                    {resolveToComponent(
                        'Alert submitted {date}{branch}',
                        {
                            date: <DateOutput value={emergency.submissionTime} />,
                            branch: emergency.reportingBranch
                                ? ` · ${emergency.reportingBranch} branch`
                                : '',
                        },
                    )}
                </span>
            )}
        </ListView>
    );

    return (
        <>
            <Modal
                heading={heading}
                headerDescription={headerDescription}
                headingLevel={2}
                onClose={onClose}
                size="lg"
                pending={fetching}
                spacing="lg"
            >
                {!fetching && !emergency && (
                    <Message
                        title="Alert details not available"
                        description="This alert could not be loaded."
                    />
                )}
                {emergency && (
                    <ListView
                        layout="block"
                        spacing="lg"
                    >
                        <Container
                            heading="Population figures"
                            headingLevel={5}
                            withHeaderBorder
                            spacing="sm"
                        >
                            <ListView
                                layout="grid"
                                numPreferredGridColumns={3}
                            >
                                <TextOutput
                                    label="Population in the affected area"
                                    value={emergency.populationInAffectedArea}
                                    valueType="number"
                                    textSize="lg"
                                    strongValue
                                    withBlockLayout
                                    withBackground
                                />
                                <TextOutput
                                    label="Affected population"
                                    value={emergency.peopleAffected}
                                    valueType="number"
                                    textSize="lg"
                                    strongValue
                                    withBlockLayout
                                    withBackground
                                />
                                <TextOutput
                                    label="Of which displaced"
                                    value={emergency.peopleDisplaced}
                                    valueType="number"
                                    textSize="lg"
                                    strongValue
                                    withBlockLayout
                                    withBackground
                                />
                            </ListView>
                        </Container>

                        <Container
                            heading="Emergency overview"
                            headingLevel={5}
                            withHeaderBorder
                            spacing="sm"
                        >
                            <ListView
                                layout="grid"
                                numPreferredGridColumns={3}
                            >
                                <TextOutput
                                    label="Emergency code"
                                    value={emergency.emergencyCode}
                                    valueType="text"
                                    withBlockLayout
                                />
                                <TextOutput
                                    label="Type of emergency / disaster"
                                    value={emergency.hazard}
                                    valueType="text"
                                    withBlockLayout
                                />
                                <TextOutput
                                    label="Emergency onset date"
                                    value={emergency.onsetDate}
                                    valueType="text"
                                    withBlockLayout
                                />
                                <TextOutput
                                    label="Region"
                                    value={emergency.region}
                                    valueType="text"
                                    withBlockLayout
                                />
                                <TextOutput
                                    label="Zone"
                                    value={emergency.zone}
                                    valueType="text"
                                    withBlockLayout
                                />
                                <TextOutput
                                    label="Woreda"
                                    value={emergency.woreda}
                                    valueType="text"
                                    withBlockLayout
                                />
                                <TextOutput
                                    label="Kebele(s)"
                                    value={emergency.kebele}
                                    valueType="text"
                                    withBlockLayout
                                />
                                <TextOutput
                                    label="Reporting ERCS branch"
                                    value={emergency.reportingBranch}
                                    valueType="text"
                                    withBlockLayout
                                />
                                <TextOutput
                                    label="Alert type"
                                    value={emergency.alertType}
                                    valueType="text"
                                    withBlockLayout
                                />
                            </ListView>
                        </Container>

                        {isDefined(emergency.generalDescription) && (
                            <Container
                                heading="General description of the emergency"
                                headingLevel={5}
                                withHeaderBorder
                                spacing="sm"
                            >
                                <div className={styles.description}>
                                    {emergency.generalDescription}
                                </div>
                            </Container>
                        )}

                        <Container
                            heading={resolveToComponent(
                                'Rapid needs assessments ({count})',
                                { count: emergency.rapidNeeds.length },
                            )}
                            headingLevel={5}
                            withHeaderBorder
                            spacing="sm"
                        >
                            {emergency.rapidNeeds.length > 0 ? (
                                <Table
                                    columns={rapidNeedsColumns}
                                    keySelector={relatedReportKeySelector}
                                    data={emergency.rapidNeeds}
                                    filtered={false}
                                    pending={false}
                                />
                            ) : (
                                <Message description="No rapid needs assessments linked to this emergency." />
                            )}
                        </Container>

                        <Container
                            heading={resolveToComponent(
                                'Field reports ({count})',
                                { count: emergency.fieldReports.length },
                            )}
                            headingLevel={5}
                            withHeaderBorder
                            spacing="sm"
                        >
                            {emergency.fieldReports.length > 0 ? (
                                <Table
                                    columns={fieldReportColumns}
                                    keySelector={relatedReportKeySelector}
                                    data={emergency.fieldReports}
                                    filtered={false}
                                    pending={false}
                                />
                            ) : (
                                <Message description="No field reports linked to this emergency." />
                            )}
                        </Container>
                    </ListView>
                )}
            </Modal>
            {isDefined(activeRnaId) && (
                <RapidNeedsModal
                    id={activeRnaId}
                    onClose={handleRnaModalClose}
                />
            )}
            {isDefined(activeFieldReportId) && (
                <FieldReportModal
                    id={activeFieldReportId}
                    onClose={handleFieldReportModalClose}
                />
            )}
        </>
    );
}

export default EmergencyDetailModal;
