import { useState } from 'react';
import {
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';

import Page from '#components/Page';

import EmergencyAlert from './EmergencyAlert';
import ErcsDisasterResponse from './ErcsDisasterResponse';

type TabKey = 'emergency-alert' | 'ercs-disaster-response' | 'pmer' | 'risk-analysis';

function Preparedness() {
    const [activeTab, setActiveTab] = useState<TabKey>('emergency-alert');

    return (
        <Page
            heading="Preparedness -  Emergency Alerts"
            description="Use data-driven forecasts and community-level indicators to plan, prepare, and minimize disaster impact."
        >
            <Tabs
                styleVariant="tab"
                value={activeTab}
                onChange={setActiveTab}
            >
                <TabList name="our-work-tabs">
                    <Tab name="emergency-alert">Emergency Alert</Tab>
                    <Tab name="ercs-disaster-response">ERCS Disaster Response</Tab>
                    <Tab name="pmer">PMER</Tab>
                    <Tab name="risk-analysis">Risk Analysis</Tab>
                </TabList>

                <TabPanel name="emergency-alert">
                    <EmergencyAlert />
                </TabPanel>
                <TabPanel name="ercs-disaster-response">
                    <ErcsDisasterResponse />
                </TabPanel>
                <TabPanel name="pmer" />
                <TabPanel name="risk-analysis" />

            </Tabs>
        </Page>
    );
}

export default Preparedness;
