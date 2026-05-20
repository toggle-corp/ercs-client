import React, { useState } from 'react';
import {
    Container,
    ListView,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@ifrc-go/ui';

import Link from '#components/Link';
import Page from '#components/Page';

type TabKey = 'internal' | 'external';

// TODO: Fetch the links from server
const additionalInternalLinks = [
    {
        name: 'Fleet Management system',
        description: 'Fleet management software allows Ethiopian Red Cross Society to concerned staff’s and dispatchers to track ambulance all vehicles respective central location. Tracking systems are used to monitor driver behavior, proper vehicle use, work breaks and safety among others.',
        url: 'https://erp.redcrosseth.org/#login',
    },
    {
        name: '121 Portal',
        description: '121 Portal is a platform designed for Cash and Voucher Assistance (CVA) program implemetation and overall management.',
        url: 'https://portal.ethiopia.121.global/en-GB/login?returnUrl=%2Fprograms',
    },
    {
        name: 'ERP portal',
        description: 'Our ERP system is designed to streamline and centralize all activities related to program management and Human resource, enabling effiicient coordination, transparency, and performance tracking.',
        url: 'https://erp.redcrosseth.org/#login',
    },
    {
        name: 'DHIS2 Ambulance Dispatch system',
        description: 'The DHIS2 Ambulance Dispatch System is a digital tool for managing emergency calls, dispatching ambulances, tracking response times, and recording patient handovers in pre-hospital care. It enables real-time data entry and monitoring to improve coordination, resource use, and emergency response efficiency.',
        url: 'https://ercs.dhis2.redcross.no/dhis-web-commons/security/login.action',
    },
];

const additionalExternalLinks = [
    {
        name: 'IFRC Disaster Response and Preparedness',
        description: 'FRC GO aims to make all disaster information universally accessible and useful to IFRC responders for better decision-making.',
        url: 'https://go.ifrc.org',
    },
    {
        name: 'IFRC Databank and Reporting System',
        description: 'FDRS is an IFRC platform dedicated to providing insights on the Red Cross Red Crescent National Societies. The data is gathered through a yearly data collection from 192 National Societies.',
        url: 'https://data.ifrc.org/fdrs/fdrs/societies/ethiopian-red-cross-society/',
    },
    {
        name: 'FEWS NET',
        description: 'FEWS NET, the Famine Early Warning Systems Network, is a leading provider of early warning and analysis on acute food insecurity around the world.',
        url: 'https://fews.net',
    },
    {
        name: 'Disaster Risk Management Knowledge Centre',
        description: 'The European Commission Disaster Risk Management Knowledge Centre integrates existing scientific multi-disciplinary knowledge and co-develops innovative solutions for existing needs',
        url: 'https://drmkc.jrc.ec.europa.eu/inform-index',
    },
    {
        name: 'MIGRATION DATA PORTAL',
        description: 'The Portal aims to serve as a unique access point to timely, comprehensive migration statistics and reliable information about migration data globally',
        url: 'https://www.migrationdataportal.org/?t=2017&i=stock_ab',
    },
    {
        name: 'IOM DTM Dashboard',
        description: 'Data Migration dashboard',
        url: 'https://dtm.iom.int/ethiopia',
    },
    {
        name: 'National Meteorology Agency',
        description: 'National Meteorology agency provide weather forecast and early warnings on the adverse effects of weather and climate of Ethiopia.',
        url: 'https://www.ethiomet.gov.et/daily_weather/',
    },
    {
        name: 'Windy',
        description: 'Windy provides a real-time meteorological map and can view 35 different weather phenomena. It was founded in 2014',
        url: 'https://www.windy.com/9.036/38.752?8.397,40.991,7',
    },
    {
        name: 'OCHA_Ethiopia',
        description: 'OCHA coordinates global humanitarian funding appeals and manages global and country-specific humanitarian response funds.',
        url: 'https://www.unocha.org/ethiopia',
    },
];

function AdditionalLinks() {
    const [activeTab, setActiveTab] = useState<TabKey>('internal');

    return (
        <Page
            heading="Additional Links"
            description="Explore additional resources and important links"
        >
            <Tabs
                styleVariant="tab"
                value={activeTab}
                onChange={setActiveTab}

            >
                <TabList>
                    <Tab name="internal">
                        Internal Links
                    </Tab>
                    <Tab name="external">
                        External Links
                    </Tab>
                </TabList>
                <TabPanel name="internal">
                    <ListView
                        layout="block"
                        spacing="2xl"
                    >
                        {additionalInternalLinks.map((link) => (
                            <Container
                                key={link.name}
                                spacingOffset={-2}
                                headingLevel={4}
                                heading={link.name}
                                headerDescription={link.description}
                            >
                                <Link
                                    href={link.url}
                                    external
                                    styleVariant="action"
                                    colorVariant="primary"
                                >
                                    {link.url}
                                </Link>
                            </Container>
                        ))}
                    </ListView>
                </TabPanel>
                <TabPanel name="external">
                    <ListView
                        layout="block"
                        spacing="2xl"
                    >
                        {additionalExternalLinks.map((link) => (
                            <Container
                                key={link.name}
                                spacingOffset={-2}
                                headingLevel={4}
                                heading={link.name}
                                headerDescription={link.description}
                            >
                                <Link
                                    href={link.url}
                                    external
                                    styleVariant="action"
                                    colorVariant="primary"
                                >
                                    {link.url}
                                </Link>
                            </Container>
                        ))}
                    </ListView>
                </TabPanel>
            </Tabs>
        </Page>
    );
}

export default AdditionalLinks;
