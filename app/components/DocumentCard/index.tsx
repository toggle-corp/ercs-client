import { useMemo } from 'react';
import {
    Description,
    Heading,
    Image,
    ListView,
} from '@ifrc-go/ui';
import { isDefined } from '@togglecorp/fujs';

import defaultDocumentCover from '#resources/image/logo.png';

import styles from './styles.module.css';

interface DocumentCardProps {
    manual: {
        title: string;
        src?: string;
        date?: string;
    };
}

function DocumentCard({ manual }: DocumentCardProps) {
    const formattedDate = useMemo(
        () => {
            if (!isDefined(manual.date)) {
                return undefined;
            }

            const date = new Date(manual.date);

            if (Number.isNaN(date.getTime())) {
                return undefined;
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
        [manual.date],
    );

    return (
        <ListView
            layout="block"
            withCenteredContents={!formattedDate}
            withPadding
        >
            <Image
                withContainedFit
                src={manual.src || defaultDocumentCover}
                size="lg"
                className={styles.documentCover}
            />
            <ListView
                layout="block"
                spacing="2xs"
            >

                <Heading
                    level={5}
                >
                    {manual.title}
                </Heading>
                {isDefined(formattedDate) && (
                    <Description withLightText textSize="sm">
                        {formattedDate}
                    </Description>
                )}
            </ListView>
        </ListView>
    );
}

export default DocumentCard;
