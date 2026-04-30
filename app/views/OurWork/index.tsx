import { useState } from 'react';
import {
    AlertLineIcon,
    HeartAddLineIcon,
    ShieldUserLineIcon,
} from '@ifrc-go/icons';
import {
    Container,
    ListView,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';

import InfoCard from '#components/InfoCard';
import KeyCard from '#components/KeyCard';
import Page from '#components/Page';
import PowerBIEmbed from '#components/PowerBiEmbed';

type TabKey = 'emergency-response' | 'project-mapping';

const powerBIReports = [
    {
        id: 1,
        embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNGJiMTdiYzItMDMwNy00ZWU2LWJhYTEtMzU3ZjhmOTJiZTFhIiwidCI6ImY2NmI3ZDQ2LTA0OTktNDM1Mi1iOTc3LTIwNWJjOTgzNzI2MCIsImMiOjh9',
    },
    {
        id: 2,
        embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNjgwOTIzYTctOWUxNS00NmU4LWE1ZDItMTQzMGY2MjY0ZmY5IiwidCI6ImY2NmI3ZDQ2LTA0OTktNDM1Mi1iOTc3LTIwNWJjOTgzNzI2MCIsImMiOjh9',
    },
    {
        id: 3,
        embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNTVmZTU0MGMtNDAyOC00YjIxLWE5MTEtMzNlZmIzYzNjODllIiwidCI6ImY2NmI3ZDQ2LTA0OTktNDM1Mi1iOTc3LTIwNWJjOTgzNzI2MCIsImMiOjh9',
    },
];

const powerBIProject = [
    {
        id: 1,
        embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiMzQzYjk3M2EtZDQwMS00YzIyLWFlYjYtMTBkNmFhZWUxZTA0IiwidCI6ImY2NmI3ZDQ2LTA0OTktNDM1Mi1iOTc3LTIwNWJjOTgzNzI2MCIsImMiOjh9',
    },
    {
        id: 2,
        embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiMjUyNWVjNmYtZGIxNS00Y2Y4LWI1NzYtNGMwMDFhNDFkNDNiIiwidCI6ImY2NmI3ZDQ2LTA0OTktNDM1Mi1iOTc3LTIwNWJjOTgzNzI2MCIsImMiOjh9',
    },
];

const keyFigures = (
    <ListView
        layout="grid"
        numPreferredGridColumns={3}
    >
        <KeyCard
            icon={<HeartAddLineIcon />}
            value={250}
            valueType="number"
            size="lg"
            label="People Reached"
            info="in last 30 days"
        />
        <KeyCard
            icon={<AlertLineIcon />}
            value={18}
            valueType="number"
            size="lg"
            valueOptions={{ compact: true }}
            label="Population Affected"
            info="in last 30 days"
        />
        <KeyCard
            icon={<ShieldUserLineIcon />}
            value={18}
            valueType="number"
            size="lg"
            label="People in Need"
            info="in last 30 days"
        />
    </ListView>
);

function OurWork() {
    const [activeTab, setActiveTab] = useState<TabKey>('emergency-response');

    return (
        <Page
            heading="National EOC Operations"
            description="Comprehensive operational intelligence and emergency coordination dashboards"
            info={(
                <Container>
                    {keyFigures}
                </Container>
            )}
        >
            <Tabs
                styleVariant="tab"
                value={activeTab}
                onChange={setActiveTab}
            >
                <TabList name="our-work-tabs">
                    <Tab name="emergency-response">
                        Emergency Response
                    </Tab>
                    <Tab name="project-mapping">
                        Project Mapping
                    </Tab>
                </TabList>
                <TabPanel name="emergency-response">
                    <ListView layout="block">
                        <InfoCard
                            icon={<AlertLineIcon />}
                            title="Emergency Response Overview Dashboard"
                            description="Real-time emergency alerts and early warning system monitoring across regions"
                        />
                        {powerBIReports.map((report) => (
                            <PowerBIEmbed
                                key={report.id}
                                embedUrl={report.embedUrl}
                            />
                        ))}
                    </ListView>
                </TabPanel>
                <TabPanel name="project-mapping">
                    <ListView layout="block">
                        <InfoCard
                            icon={<AlertLineIcon />}
                            title="ERCS Project Mapping Dashboard"
                            description="Real-time emergency alerts and early warning system monitoring across regions"
                        />
                        {powerBIProject.map((report) => (
                            <PowerBIEmbed
                                key={report.id}
                                embedUrl={report.embedUrl}
                            />
                        ))}
                    </ListView>
                </TabPanel>
            </Tabs>
        </Page>
    );
}

export default OurWork;
