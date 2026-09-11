import {
    AlarmWarningLineIcon,
    AlertLineIcon,
    DashboardFillIcon,
    HeartAddLineIcon,
    ShieldUserLineIcon,
} from '@ifrc-go/icons';
import {
    Container,
    ListView,
} from '@ifrc-go/ui';
import { isDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import DashboardCard from '#components/DashboardCard';
import InfoCard from '#components/InfoCard';
import KeyCard from '#components/KeyCard';
import Page from '#components/Page';
import {
    DashboardPage,
    type ExternalDashboardsQuery,
    useExternalDashboardsQuery,
    useKoboStatsQuery,
} from '#generated/types/graphql';
import type { RouteKeys } from '#root/config/routes';
import useRouting from '#root/hooks/useRouting';
import ActiveOperation from '#views/Home/ActiveOperation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const KOBO_STATS_QUERY = gql`
    query KoboStats {
        koboStats {
            alert {
                totalEmergencies
                peopleAffected
                source {
                    formLabel
                    assetUid
                    lastFetchedAt
                    confirmedRecords
                }
            }
            rapidNeeds {
                peopleInNeed
            }
            field {
                peopleReached
            }
        }
    }
`;

type ExternalDashboard = ExternalDashboardsQuery['externalDashboards']['results'][number];

function formatLastUpdated(value: string | null | undefined) {
    if (!value) {
        return undefined;
    }
    const date = new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    return `Updated ${date}`;
}

const DASHBOARD_PAGE_TO_ROUTE_KEY: Record<DashboardPage, RouteKeys> = {
    [DashboardPage.CapacityResources]: 'capacityAndResources',
    [DashboardPage.DisasterResponse]: 'disasterResponse',
    [DashboardPage.EmergencyAlerts]: 'emergencyAlert',
    [DashboardPage.EmergencyResponse]: 'emergencyResponse',
    [DashboardPage.Home]: 'home',
    [DashboardPage.Operations]: 'home',
    [DashboardPage.ProjectMapping]: 'projectMapping',
};

function Home() {
    const routeTo = useRouting();

    const [{ data, fetching }] = useExternalDashboardsQuery({
        variables: {
            filters: {
                isActive: true,
                showOnHome: true,
            },
            pagination: {
                limit: 6,
            },
        },
    });

    const [{ data: koboData }] = useKoboStatsQuery();
    const koboStats = koboData?.koboStats;
    const lastUpdated = formatLastUpdated(koboStats?.alert.source.lastFetchedAt);

    const operationDashboards = data?.externalDashboards.results ?? [];

    const handleViewClick = (dashboard: ExternalDashboard) => {
        const { page, capacityAndResourceId } = dashboard;

        if (page === DashboardPage.CapacityResources && isDefined(capacityAndResourceId)) {
            routeTo('capacityAndResourcesDetails', { id: capacityAndResourceId });
            return;
        }

        const routeKey = DASHBOARD_PAGE_TO_ROUTE_KEY[page];
        routeTo(routeKey);
    };

    const keyFigures = (
        <ListView
            layout="grid"
            numPreferredGridColumns={4}
        >
            <KeyCard
                icon={<AlarmWarningLineIcon />}
                value={koboStats?.alert.totalEmergencies ?? 0}
                valueType="number"
                size="lg"
                label="Emergencies"
                info={lastUpdated}
            />
            <KeyCard
                icon={<HeartAddLineIcon />}
                value={koboStats?.field.peopleReached ?? 0}
                valueType="number"
                size="lg"
                valueOptions={{ compact: true }}
                label="People reached"
                info={lastUpdated}
            />
            <KeyCard
                icon={<AlertLineIcon />}
                value={koboStats?.alert.peopleAffected ?? 0}
                valueType="number"
                size="lg"
                valueOptions={{ compact: true }}
                label="Population affected"
                info={lastUpdated}
            />
            <KeyCard
                icon={<ShieldUserLineIcon />}
                value={koboStats?.rapidNeeds.peopleInNeed ?? 0}
                valueType="number"
                valueOptions={{ compact: true }}
                label="People in Need"
                size="lg"
                info={lastUpdated}
            />
        </ListView>
    );
    return (
        <Page
            title="Home"
            heading="ERCS Emergency Operations Centre"
            description="Real-time operational intelligence and situational awareness for emergency response"
            info={(
                <Container>
                    {keyFigures}
                </Container>
            )}
        >
            <ListView
                layout="block"
            >
                <ActiveOperation />
                <Container
                    pending={fetching}
                >
                    <ListView
                        layout="block"
                    >

                        <InfoCard
                            icon={<DashboardFillIcon />}
                            title="Operational Dashboards"
                            description="Real-time emergency alerts and early warning system monitoring across regions"
                        />
                        <ListView
                            layout="grid"
                            numPreferredGridColumns={3}
                        >
                            {operationDashboards.map((res) => (
                                <DashboardCard
                                    key={res.id}
                                    title={res.title}
                                    summary={res.description}
                                    pillText={res.pageDisplay}
                                    onViewClick={() => handleViewClick(res)}
                                />
                            ))}
                        </ListView>
                    </ListView>
                </Container>
            </ListView>
        </Page>
    );
}

export default Home;
