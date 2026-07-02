import { StarLineIcon } from '@ifrc-go/icons';
import {
    Container,
    Description,
    Heading,
    InlineView,
    ListView,
} from '@ifrc-go/ui';

import styles from './styles.module.css';

interface AISummaryProps {
    loading? : boolean,
    summary: string
}

function AIsummary(props: AISummaryProps) {
    const { loading, summary } = props;
    return (
        <ListView
            layout="block"
            withPadding
            className={styles.aiSummary}
            spacing="2xl"
        >
            <InlineView
                before={<StarLineIcon width={24} height={24} />}
                spacing="sm"
                contentAlignment="center"
            >
                <Heading level={2}>AI Summary</Heading>
            </InlineView>
            <Container
                className={styles.summaryContainer}
                pending={loading}
                pendingMessage="Generating...."
                withContentOverflow
            >
                <Description textSize="lg">
                    {summary}
                </Description>
            </Container>
        </ListView>
    );
}

export default AIsummary;
