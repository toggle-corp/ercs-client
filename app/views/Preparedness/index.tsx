import { Outlet } from 'react-router';
import {
    AlertLineIcon,
    AnalyzingIcon,
    EmergencyResponseUnitIcon,
    InspectIcon,
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
                            <AlertLineIcon fontSize={18} />
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
                            <EmergencyResponseUnitIcon fontSize={18} />
                            <span>
                                Disaster Response
                            </span>
                        </ListView>
                    </NavigationTab>
                    <NavigationTab
                        to="pmer"
                    >
                        <ListView
                            spacing="2xs"
                        >
                            <InspectIcon fontSize={18} />
                            <span>
                                PMER
                            </span>
                        </ListView>
                    </NavigationTab>
                    <NavigationTab
                        to="riskAnalysis"
                    >
                        <ListView
                            spacing="2xs"
                        >
                            <AnalyzingIcon fontSize={18} />
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
