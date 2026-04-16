import {
    AlertLineIcon,
    HeartAddLineIcon,
    InformationFillIcon,
} from '@ifrc-go/icons';
import {
    Container,
    KeyFigureView,
    ListView,
} from '@ifrc-go/ui';

import Page from '#components/Page';

function OurWork() {
    const keyFigures = (
        <ListView
            layout="grid"
            numPreferredGridColumns={3}
        >
            <KeyFigureView
                icon={<HeartAddLineIcon />}
                value={250}
                valueType="number"
                size="lg"
                label="People reached in last 30 days"
            />
            <KeyFigureView
                icon={<AlertLineIcon />}
                value={18}
                valueType="number"
                size="lg"
                valueOptions={{ compact: true }}
                label="population Affected in last 30 days"
            />
            <KeyFigureView
                icon={<InformationFillIcon />}
                value={18}
                valueType="number"
                label="People in Need in last 30 days"
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
