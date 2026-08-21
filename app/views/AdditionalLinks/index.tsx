import { useState } from 'react';
import {
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';

import AdditionalLinkList from '#components/AdditionalLinkList';
import Page from '#components/Page';
import { LinkTypeEnum } from '#generated/types/graphql';

function AdditionalLinks() {
    const [activeTab, setActiveTab] = useState<LinkTypeEnum>(LinkTypeEnum.Internal);

    return (
        <Page
            title="Additional Links"
            heading="Additional Links"
            description="Explore additional resources and important links"
        >
            <Tabs
                styleVariant="tab"
                value={activeTab}
                onChange={setActiveTab}
            >
                <TabList>
                    <Tab name={LinkTypeEnum.Internal}>
                        Internal Links
                    </Tab>
                    <Tab name={LinkTypeEnum.External}>
                        External Links
                    </Tab>
                </TabList>
                <TabPanel name={LinkTypeEnum.Internal}>
                    <AdditionalLinkList linkType={LinkTypeEnum.Internal} />
                </TabPanel>
                <TabPanel name={LinkTypeEnum.External}>
                    <AdditionalLinkList linkType={LinkTypeEnum.External} />
                </TabPanel>
            </Tabs>
        </Page>
    );
}

export default AdditionalLinks;
