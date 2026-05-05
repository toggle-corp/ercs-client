import { Outlet } from 'react-router';
import { NavigationTabList } from '@ifrc-go/ui';

import NavigationTab from '#components/NavigationTab';
import Page from '#components/Page';

function Preparedness() {
    return (
        <Page
            heading="Preparedness -  Emergency Alerts"
            description="Use data-driven forecasts and community-level indicators to plan, prepare, and minimize disaster impact."
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
                    Ercs Disaster Response
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
        </Page>
    );
}

export default Preparedness;
