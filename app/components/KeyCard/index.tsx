import React from 'react';
import {
    Container,
    Description,
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
        withIconBackground,
        ...keyFigureProps
    } = props;

    return (
        <Container
            withPadding
            withBackground
            className={_cs(styles.keyCard, className)}
        >
            <ListView
                layout="block"
                spacing="xs"
            >
                {(isDefined(icon) || isDefined(pillText)) && (
                    icon && (
                        <ListView
                            className={_cs(
                                styles.icon,
                                withIconBackground && styles.iconWithBackground,
                            )}
                        >
                            {icon}
                        </ListView>
                    )

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
                </ListView>
            </ListView>
        </Container>
    );
}

export default KeyCard;
