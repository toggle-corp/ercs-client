import {
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    Button,
    Container,
    NumberOutput,
    Pager,
    Table,
} from '@ifrc-go/ui';
import {
    createDateColumn,
    createElementColumn,
    createNumberColumn,
    createStringColumn,
    resolveToComponent,
} from '@ifrc-go/ui/utils';
import { isDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import ExportButton from '#components/ExportButton';
import {
    type KoboEmergenciesQuery,
    useKoboEmergenciesQuery,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import useFilterState from '#hooks/useFilterState';
import useGraphQLToCSV from '#hooks/useGraphqlToCsv';
import EmergencyDetailModal from '#views/Home/EmergencyDetailModal';

import styles from './styles.module.css';

const KOBO_EMERGENCIES_QUERY = gql`
    query KoboEmergencies($pagination: OffsetPaginationInput) {
        koboEmergencies(pagination: $pagination, order: { submissionTime: DESC }) {
            totalCount
            results {
                id
                koboId
                emergencyCode
                title
                hazard
                alertType
                region
                startDate
                peopleAffected
                peopleDisplaced
                submissionTime
                latitude
                longitude
            }
        }
    }
`;

type KoboEmergency = NonNullable<
    KoboEmergenciesQuery['koboEmergencies']['results']
>[number];

const koboEmergencyKeySelector = (item: KoboEmergency) => item.id;

interface AlertNameButtonProps {
    id: string;
    title: string;
    onClick: (id: string) => void;
}

function AlertNameButton(props: AlertNameButtonProps) {
    const { id, title, onClick } = props;
    return (
        <Button
            name={id}
            onClick={onClick}
            styleVariant="transparent"
        >
            {title}
        </Button>
    );
}

function FieldAlerts() {
    const alert = useAlert();

    const {
        page,
        setPage,
        limit,
        offset,
    } = useFilterState({
        filter: {},
        pageSize: 10,
    });

    const [activeAlertId, setActiveAlertId] = useState<string | undefined>();

    const handleModalClose = useCallback(() => {
        setActiveAlertId(undefined);
    }, []);

    const [{ data, fetching }] = useKoboEmergenciesQuery({
        variables: {
            pagination: { limit, offset },
        },
    });
    const emergencies = data?.koboEmergencies.results;
    const count = data?.koboEmergencies.totalCount ?? 0;

    const {
        pending: exportPending,
        progress: exportProgress,
        error: exportError,
        trigger: triggerExport,
    } = useGraphQLToCSV<KoboEmergenciesQuery>({
        query: KOBO_EMERGENCIES_QUERY,
        filename: 'ercs-field-alerts.csv',
        fieldName: 'koboEmergencies',
        transform: (responseData) => (
            responseData.koboEmergencies.results ?? []
        ).map((item) => ({
            'Start Date': item.startDate,
            'Emergency Code': item.emergencyCode,
            'Disaster Type': item.hazard,
            Region: item.region,
            'Alert Type': item.alertType,
            '# Affected': item.peopleAffected,
            '# Displaced': item.peopleDisplaced,
        })),
    });

    useEffect(
        () => {
            if (isDefined(exportError)) {
                alert.show(
                    'Failed to generate export.',
                    { variant: 'danger' },
                );
            }
        },
        [exportError, alert],
    );

    const columns = [
        createDateColumn<KoboEmergency, string>(
            'startDate',
            'Start Date',
            (item) => item.startDate,
            { columnClassName: styles.createdAt },
        ),
        createElementColumn<KoboEmergency, string, AlertNameButtonProps>(
            'title',
            'Name',
            AlertNameButton,
            (_, item) => ({
                id: item.id,
                title: item.title,
                onClick: setActiveAlertId,
            }),
        ),
        createStringColumn<KoboEmergency, string>(
            'emergencyCode',
            'Emergency Code',
            (item) => item.emergencyCode,
        ),
        createStringColumn<KoboEmergency, string>(
            'hazard',
            'Disaster Type',
            (item) => item.hazard,
        ),
        createStringColumn<KoboEmergency, string>(
            'region',
            'Region',
            (item) => item.region,
        ),
        createNumberColumn<KoboEmergency, string>(
            'peopleAffected',
            '# Affected',
            (item) => item.peopleAffected,
        ),
        createNumberColumn<KoboEmergency, string>(
            'peopleDisplaced',
            '# Displaced',
            (item) => item.peopleDisplaced,
        ),
    ];

    const heading = resolveToComponent(
        'ERCS Field Alerts ({numAlerts})',
        { numAlerts: <NumberOutput value={count} /> },
    );

    return (
        <>
            <Container
                heading={heading}
                withHeaderBorder
                headerDescription="Emergency alerts reported by ERCS regional branches, sourced from Kobo. Shown on the Active Operations map above."
                headerActions={(
                    <ExportButton
                        onClick={triggerExport}
                        progress={exportProgress}
                        pendingExport={exportPending}
                        totalCount={count}
                    />
                )}
                footerActions={(
                    <Pager
                        activePage={page}
                        itemsCount={count}
                        maxItemsPerPage={limit}
                        onActivePageChange={setPage}
                    />
                )}
            >
                <Table
                    pending={fetching}
                    className={styles.table}
                    columns={columns}
                    keySelector={koboEmergencyKeySelector}
                    data={emergencies}
                    filtered={false}
                />
            </Container>
            {isDefined(activeAlertId) && (
                <EmergencyDetailModal
                    id={activeAlertId}
                    onClose={handleModalClose}
                />
            )}
        </>
    );
}

export default FieldAlerts;
