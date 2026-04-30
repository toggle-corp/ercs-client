import { AlertLineIcon } from '@ifrc-go/icons';
import { ListView } from '@ifrc-go/ui';

import InfoCard from '#components/InfoCard';
import PowerBIEmbed from '#components/PowerBiEmbed';

const powerBIReports = [
    {
        id: 1,
        embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiZGNlNjQxMTgtN2EzZS00NmE2LWExZTMtOTY3NTRmYjllYjczIiwidCI6ImY2NmI3ZDQ2LTA0OTktNDM1Mi1iOTc3LTIwNWJjOTgzNzI2MCIsImMiOjh9&cacheUpdate=1777448420443',
    },
];

function EmergencyAlert() {
    return (
        <ListView layout="block">
            <InfoCard
                icon={<AlertLineIcon />}
                title="Alerts Dashboard"
                description="Real-time emergency alerts and early warning system monitoring across regions"
            />
            {powerBIReports.map((report) => (
                <PowerBIEmbed
                    key={report.id}
                    embedUrl={report.embedUrl}
                />
            ))}
        </ListView>
    );
}
export default EmergencyAlert;
