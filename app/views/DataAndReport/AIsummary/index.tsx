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

const pendingMessages = [
    'Reading the document...',
    'Analyzing the content...',
    'Identifying the key points...',
    'Drafting the summary...',
    'Taking a little longer than usual. Hang tight...',
];

const PENDING_MESSAGE_INTERVAL = 5000;
const COPIED_FEEDBACK_DURATION = 2000;
const skeletonLineKeys = Array.from({ length: 5 }, (_, i) => i);

interface Props {
    loading?: boolean;
    summary: string;
}

function AIsummary(props: Props) {
    const copiedTimeoutRef = useRef<number | undefined>(undefined);
    const { loading, summary } = props;

    const hasSummary = isTruthyString(summary);
    const [pendingMessageIndex, setPendingMessageIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [wasLoading, setWasLoading] = useState(loading);

    if (wasLoading !== loading) {
        setWasLoading(loading);
        if (loading) {
            setPendingMessageIndex(0);
        }
    }

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

    useEffect(() => {
        if (!loading) {
            return undefined;
        }
        const interval = window.setInterval(() => {
            setPendingMessageIndex(
                (prevIndex) => Math.min(prevIndex + 1, pendingMessages.length - 1),
            );
        }, PENDING_MESSAGE_INTERVAL);

        return () => {
            window.clearInterval(interval);
        };
    }, [loading]);

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
                {loading ? (
                    <div
                        className={styles.skeleton}
                        aria-busy="true"
                    >
                        <Description withLightText>
                            {pendingMessages[pendingMessageIndex]}
                        </Description>
                        {skeletonLineKeys.map((key) => (
                            <div
                                key={key}
                                className={styles.skeletonLine}
                            />
                        ))}
                    </div>
                ) : (
                    <Description
                        textSize="md"
                        className={styles.summaryText}
                    >
                        {summary}
                    </Description>
                )}
            </Container>
        </ListView>
    );
}

export default AIsummary;
