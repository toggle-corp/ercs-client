import React from 'react';
import {
    Button,
    Container,
    Description,
    InlineLayout,
    KeyFigure,
    type KeyFigureProps,
    ListView,
} from '@ifrc-go/ui';
import {
    _cs,
    isDefined,
    isTruthyString,
} from '@togglecorp/fujs';

import styles from './styles.module.css';

type KeyCardProps = KeyFigureProps & {
    withShadow?: boolean
    icon?: React.ReactNode;
    pillText?: React.ReactNode;
    info?: string | null;
    withIconBackground?: boolean;
    viewButton? :boolean;
    onViewClick?: () => void
}

function KeyCard(props : KeyCardProps) {
    const {
        className,
        icon,
        pillText,
        info,
        withShadow,
        withIconBackground,
        viewButton,
        onViewClick,
        ...keyFigureProps
    } = props;

    return (
        <Container
            withPadding
            withBackground
            withShadow={withShadow}
            className={_cs(styles.keyCard, className)}
        >
            <ListView
                layout="block"
                spacing="xs"
            >
                {(isDefined(icon) || isDefined(pillText)) && (
                    <ListView withSpaceBetweenContents>
                        {icon && (
                            <ListView
                                withCenteredContents
                                className={_cs(
                                    styles.icon,
                                    withIconBackground && styles.iconWithBackground,
                                )}
                            >
                                {icon}
                            </ListView>
                        )}
                        {pillText && (
                            <ListView
                                withDarkBackground
                                withPadding
                                spacing="3xs"
                                className={styles.pill}
                            >
                                <Description textSize="md">
                                    {pillText}
                                </Description>
                            </ListView>
                        )}

                    </ListView>
                )}
                <ListView
                    layout="block"
                    spacing="xl"
                >
                    <ListView
                        layout="block"
                        spacing="4xs"
                    >
                        <KeyFigure
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...keyFigureProps}
                        />
                        {isTruthyString(info) && (
                            <Description
                                textSize="sm"
                                withLightText
                                className={styles.info}
                            >
                                {info}
                            </Description>
                        )}
                    </ListView>
                    {isDefined(viewButton)
                        && (
                            <InlineLayout after={(
                                <Button
                                    name="view"
                                    onClick={onViewClick}
                                >
                                    View
                                </Button>
                            )}
                            />
                        )}
                </ListView>
            </ListView>
        </Container>
    );
}

export default KeyCard;
