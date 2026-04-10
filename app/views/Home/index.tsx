import {
    AlarmWarningFillIcon,
    AlertLineIcon,
    HeartAddLineIcon,
    InformationFillIcon,
} from "@ifrc-go/icons"
import {
    Container,
    KeyFigureView,
    ListView
} from "@ifrc-go/ui"

import Page from "#components/Page"

const Home = () => {
    const keyFigures = (
        <ListView
            layout="grid"
            numPreferredGridColumns={4}
        >
            <KeyFigureView
                icon={<AlarmWarningFillIcon />}
                value={12}
                valueType="number"
                size="lg"
                label="Emergencies in last 30 days"
            />
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
            heading="ERCS Emergency Operations Centre"
            description= "Real-time operational intelligence and situational awareness for emergency response"
            withBackgroundColorInMainSection
            info={(
                <Container >
                    {keyFigures}
                </Container>
            )}
        >            
        </Page>
    )
}

export default Home