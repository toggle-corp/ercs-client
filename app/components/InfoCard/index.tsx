import React from 'react';
import {
    Container,
    type ContainerProps,
    Description,
    Heading,
    InlineLayout,
    ListView,
} from '@ifrc-go/ui';

import styles from './styles.module.css';

interface InfoCardProps extends Omit<ContainerProps, 'children'> {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
    icon,
    title,
    description,
    withDarkBackground = true,
    ...containerProps
}) => (
    <Container
        className={styles.infoCard}
        withDarkBackground={withDarkBackground}
        withPadding
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...containerProps}
    >
        <ListView
            layout="block"
            spacing="2xs"
        >
            <InlineLayout
                before={(
                    <div className={styles.icon}>
                        {icon}
                    </div>
                )}
                spacing="2xs"
            >
                <Heading
                    level={4}
                >
                    {title}
                </Heading>
            </InlineLayout>
            <Description>
                {description}
            </Description>
        </ListView>
    </Container>
);

export default InfoCard;
