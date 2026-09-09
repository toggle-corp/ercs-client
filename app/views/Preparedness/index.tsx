import { Outlet } from 'react-router';
import {
    AlertLineIcon,
    AnalyzingIcon,
    EmergencyResponseUnitIcon,
} from '@ifrc-go/icons';
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
            title="Preparedness"
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
                        <ListView
                            spacing="2xs"
                        >
                            <AlertLineIcon />
                            <span>
                                Emergency Alert
                            </span>
                        </ListView>
                    </NavigationTab>
                    <NavigationTab
                        to="disasterResponse"
                    >
                        <ListView
                            spacing="2xs"
                        >
                            <EmergencyResponseUnitIcon />
                            <span>
                                Disaster Response
                            </span>
                        </ListView>
                    </NavigationTab>
                    <NavigationTab
                        to="riskAnalysis"
                    >
                        <ListView
                            spacing="2xs"
                        >
                            <AnalyzingIcon />
                            <span>
                                Risk Analysis
                            </span>
                        </ListView>
                    </NavigationTab>
                </NavigationTabList>
                <Outlet />
            </ListView>
        </Page>
    );
}

export default Preparedness;
