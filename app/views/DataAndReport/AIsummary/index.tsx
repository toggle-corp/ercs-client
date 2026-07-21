import {
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    CheckLineIcon,
    CopyLineIcon,
    MagicLineIcon,
} from '@ifrc-go/icons';
import {
    Button,
    Container,
    Description,
    Heading,
    InlineLayout,
    InlineView,
    ListView,
} from '@ifrc-go/ui';
import { isTruthyString } from '@togglecorp/fujs';

import styles from './styles.module.css';

const emptyMessage = (
    <span className={styles.pendingMessage}>
        The AI summary is being generated and may take some time, especially for larger
        reports. Feel free to come back and check again later
        <span className={styles.dots} aria-hidden>
            {Array.from({ length: 5 }, (_, index) => (
                <span
                    key={index}
                    className={styles.dot}
                    style={{ animationDelay: `${index * 0.2}s` }}
                >
                    .
                </span>
            ))}
        </span>
    </span>
);

const COPIED_FEEDBACK_DURATION = 2000;

interface Props {
    loading?: boolean;
    summary: string;
}

function AIsummary(props: Props) {
    const copiedTimeoutRef = useRef<number | undefined>(undefined);
    const { loading, summary } = props;

    const hasSummary = isTruthyString(summary);

    const [copied, setCopied] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(summary).then(() => {
            setCopied(true);
            window.clearTimeout(copiedTimeoutRef.current);
            copiedTimeoutRef.current = window.setTimeout(() => {
                setCopied(false);
            }, COPIED_FEEDBACK_DURATION);
        });
    };

    useEffect(() => () => {
        window.clearTimeout(copiedTimeoutRef.current);
    }, []);

    return (
        <ListView
            layout="block"
            withBackground
            withPadding
            className={styles.aiSummary}
        >
            <InlineView
                before={(
                    <Description withLightText>
                        <MagicLineIcon
                            className={styles.aiIcon}
                            width={24}
                            height={24}
                        />
                    </Description>
                )}
                spacing="xs"
                contentAlignment="center"
                className={styles.heading}
            >
                <Heading level={3}>AI Summary</Heading>
            </InlineView>
            <Container
                className={styles.summaryContainer}
                withContentOverflow
                withBackground
                spacing="lg"
                pending={loading}
                pendingMessage="Generating your AI summary... This may take a few moments."
                empty={!hasSummary}
                emptyMessage={emptyMessage}
                withFooterBorder={hasSummary}
                footer={hasSummary && (
                    <InlineLayout
                        after={(
                            <Button
                                name={undefined}
                                onClick={handleCopyClick}
                                title="Copy summary"
                                styleVariant="action"
                            >
                                {copied ? <CheckLineIcon /> : <CopyLineIcon />}
                            </Button>
                        )}
                    />
                )}
            >
                <Description
                    textSize="md"
                    className={styles.summaryText}
                >
                    {summary}
                </Description>
            </Container>
        </ListView>
    );
}

export default AIsummary;
