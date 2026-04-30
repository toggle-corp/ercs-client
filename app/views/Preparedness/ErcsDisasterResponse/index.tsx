import { AlertLineIcon } from '@ifrc-go/icons';
import { ListView } from '@ifrc-go/ui';

import InfoCard from '#components/InfoCard';
import PowerBIEmbed from '#components/PowerBiEmbed';

const powerBIReports = [
    {
        id: 1,
        embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTViNTJhMTItZTRhYi00MDVkLWIzYmQtMGY1Zjc4ZDhhZjUzIiwidCI6ImY2NmI3ZDQ2LTA0OTktNDM1Mi1iOTc3LTIwNWJjOTgzNzI2MCIsImMiOjh9',
    },
    {
        id: 2,
        embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNzJkYTUyOTgtN2IwNi00YTM0LWEwZGYtMjQ5NTk0MTI1OTc4IiwidCI6ImY2NmI3ZDQ2LTA0OTktNDM1Mi1iOTc3LTIwNWJjOTgzNzI2MCIsImMiOjh9',
    },
];

function ErcsDisasterResponse() {
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
export default ErcsDisasterResponse;
