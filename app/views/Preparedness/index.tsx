import { Outlet } from 'react-router';
import {
    ListView,
    NavigationTabList,
} from '@ifrc-go/ui';

import NavigationTab from '#components/NavigationTab';
import Page from '#components/Page';

import AllEmergency from './AllEmergencies';

function Preparedness() {
    return (
        <Page
            heading="Preparedness -  Emergency Alerts"
            description="Use data-driven forecasts and community-level indicators to plan, prepare, and minimize disaster impact."
        >
            <AllEmergency />
            <ListView
                layout="block"
                spacing="xl"
            >
                <NavigationTabList>
                    <NavigationTab
                        to="emergencyAlert"
                    >
                        Emergency Alert
                    </NavigationTab>
                    <NavigationTab
                        to="disasterResponse"
                    >
                        Disaster Response
                        {' '}
                    </NavigationTab>
                    <NavigationTab
                        to="pmer"
                    >
                        PMER
                    </NavigationTab>
                    <NavigationTab
                        to="riskAnalysis"
                    >
                        Risk Analysis
                    </NavigationTab>
                </NavigationTabList>
                <Outlet />
            </ListView>
        </Page>
    );
}

export default Preparedness;
