import React from 'react';
import {
    Button,
    Container,
    Description,
    Heading,
    InlineLayout,
    ListView,
} from '@ifrc-go/ui';
import {
    _cs,
    isDefined,
    isTruthyString,
} from '@togglecorp/fujs';

import styles from './styles.module.css';

interface Props {
    className?: string;
    title: string;
    summary?: string | null;
    pillText?: React.ReactNode;
    viewLabel?: React.ReactNode;
    onViewClick?: () => void;
}

function DashboardCard(props: Props) {
    const {
        className,
        title,
        summary,
        pillText,
        viewLabel = 'View',
        onViewClick,
    } = props;

    return (
        <Container
            withPadding
            withBackground
            className={_cs(styles.dashboardCard, className)}
        >
            <ListView
                layout="block"
                spacing="sm"
            >
                {isDefined(pillText) && (
                    <ListView
                        withDarkBackground
                        withPadding
                        withCenteredContents
                        className={styles.pill}
                    >
                        {pillText}
                    </ListView>

                )}
                <InlineLayout
                    contentAlignment="start"
                    spacing="xs"
                    after={isDefined(onViewClick) && (
                        <Button
                            name="view"
                            styleVariant="outline"
                            onClick={onViewClick}
                            className={styles.viewButton}
                        >
                            {viewLabel}
                        </Button>
                    )}
                >
                    <ListView
                        layout="block"
                        spacing="none"
                        className={styles.text}
                    >
                        <Heading
                            level={4}
                            className={styles.title}
                        >
                            {title}
                        </Heading>
                        {isTruthyString(summary) && (
                            <Description
                                withLightText
                                textSize="sm"
                                className={styles.summary}
                            >
                                {summary}
                            </Description>
                        )}
                    </ListView>
                </InlineLayout>
            </ListView>
        </Container>
    );
}

export default DashboardCard;
