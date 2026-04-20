import { useState } from 'react';
import {
    Tab,
    TabList,
    Tabs,
} from '@ifrc-go/ui';

import Page from '#components/Page';

function DataAndReport() {
    const [activeTab, setActiveTab] = useState('situational-report');
    return (
        <Page
            heading="Dataset Overview"
            description="Explore historical data, research findings and operational reports to support informed decision-making and planning."
        >
            <Tabs
                styleVariant="tab"
                key="data-and-report"
                value={activeTab}
                onChange={setActiveTab}

            >
                <TabList
                    name="sd"
                >
                    <Tab name="situational-report">Situational Report</Tab>
                    <Tab name="governance-documents">Governance documents</Tab>
                    <Tab name="im-products-&-datasets">Im products & Datasets</Tab>
                </TabList>
            </Tabs>
        </Page>
    );
}

export default DataAndReport;
