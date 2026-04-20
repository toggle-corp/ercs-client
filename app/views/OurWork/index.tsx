import {
    AlertLineIcon,
    HeartAddLineIcon,
    InformationFillIcon,
} from '@ifrc-go/icons';
import {
    Container,
    ListView,
} from '@ifrc-go/ui';

import KeyCard from '#components/KeyCard';
import Page from '#components/Page';

function OurWork() {
    const keyFigures = (
        <ListView
            layout="grid"
            numPreferredGridColumns={3}
        >
            <KeyCard
                icon={<HeartAddLineIcon />}
                value={250}
                valueType="number"
                size="lg"
                label="People reached"
                info="in last 30 days"

            />
            <KeyCard
                icon={<AlertLineIcon />}
                value={18}
                valueType="number"
                size="lg"
                valueOptions={{ compact: true }}
                label="population Affected"
                info="in last 30 days"

            />
            <KeyCard
                icon={<InformationFillIcon />}
                value={18}
                valueType="number"
                label="People in Need"
                info="in last 30 days"
                size="lg"
            />
        </ListView>
    );
    return (
        <Page
            heading="National EOC Operations"
            description="Comprehensive operational intelligence and emergency coordination dashboards"
            info={(
                <Container>
                    {keyFigures}
                </Container>
            )}
        />
    );
}

export default OurWork;
