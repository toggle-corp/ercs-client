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

import InfoCard from '#components/InfoCard';
import KeyCard from '#components/KeyCard';
import Page from '#components/Page';
import {
    DashboardPage,
    useExternalDashboardsQuery,
} from '#generated/types/graphql';
import type { RouteKeys } from '#root/config/routes';
import useRouting from '#root/hooks/useRouting';
import ActiveOperation from '#views/Home/ActiveOperation';

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

    const operationDashboards = data?.externalDashboards.results ?? [];

    const handleViewClick = (page: DashboardPage) => {
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
                value={12}
                valueType="number"
                size="lg"
                label="Emergencies"
                info="in last 30 days"

            />
            <KeyCard
                icon={<HeartAddLineIcon />}
                value={250}
                valueType="number"
                size="lg"
                label="People reached"
                info="in last 30 days"

            />
            <KeyCard
                icon={<AlertLineIcon />}
                value={18}
                valueType="number"
                size="lg"
                valueOptions={{ compact: true }}
                label="population Affected"
                info="in last 30 days"

            />
            <KeyCard
                icon={<ShieldUserLineIcon />}
                value={18}
                valueType="number"
                label="People in Need"
                size="lg"
                info="in last 30 days"
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
                                <KeyCard
                                    key={res.id}
                                    value={res.title}
                                    valueType="text"
                                    size="sm"
                                    info={res.description}
                                    pillText={res.pageDisplay}
                                    withIconBackground
                                    withShadow
                                    viewButton
                                    onViewClick={() => handleViewClick(res.page)}
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
