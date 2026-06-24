import { StarLineIcon } from '@ifrc-go/icons';
import {
    BlockLoading,
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
            {loading ? (
                <BlockLoading
                    withoutBorder
                    message="Generating...."
                />
            ) : (
                <Description textSize="lg">
                    {summary}
                </Description>
            ) }
        </ListView>
    );
}

export default AIsummary;
