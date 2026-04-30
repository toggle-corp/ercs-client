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
import ActiveOperation from '#views/Home/ActiveOperation';

function Home() {
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
                <InfoCard
                    icon={<DashboardFillIcon />}
                    title="Operational Dashboards"
                    description="Real-time emergency alerts and early warning system monitoring across regions"
                />
                <ListView
                    layout="grid"
                    numPreferredGridColumns={3}
                >
                    <KeyCard
                        value="Emergency Response Dashboard"
                        valueType="text"
                        info=" Real-time overview of all active emergency operations"
                        size="sm"
                        pillText="Operation"
                        withIconBackground
                        withShadow
                        viewButton
                    />
                    <KeyCard
                        value="Emergency Response Dashboard"
                        valueType="text"
                        info=" Real-time overview of all active emergency operations"
                        size="sm"
                        pillText="Operation"
                        withIconBackground
                        withShadow
                        viewButton
                    />
                    <KeyCard
                        value="Emergency Response Dashboard"
                        valueType="text"
                        info=" Real-time overview of all active emergency operations"
                        size="sm"
                        pillText="Operation"
                        withIconBackground
                        withShadow
                        viewButton
                    />
                    <KeyCard
                        value="Emergency Response Dashboard"
                        valueType="text"
                        info=" Real-time overview of all active emergency operations"
                        size="sm"
                        pillText="Operation"
                        withIconBackground
                        withShadow
                        viewButton
                    />
                    <KeyCard
                        value="Emergency Response Dashboard"
                        valueType="text"
                        info=" Real-time overview of all active emergency operations"
                        size="sm"
                        pillText="Operation"
                        withIconBackground
                        withShadow
                        viewButton
                    />
                    <KeyCard
                        value="Emergency Response Dashboard"
                        valueType="text"
                        info=" Real-time overview of all active emergency operations"
                        size="sm"
                        pillText="Operation"
                        withIconBackground
                        withShadow
                        viewButton
                    />
                </ListView>
            </ListView>
        </Page>
    );
}

export default Home;
