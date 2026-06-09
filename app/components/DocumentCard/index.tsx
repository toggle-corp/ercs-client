import {
    Description,
    Heading,
    Image,
    ListView,
} from '@ifrc-go/ui';
import { isDefined } from '@togglecorp/fujs';

import styles from './styles.module.css';

interface DocumentCardProps {
    manual: {
        title: string;
        src: string;
        date?: string;
    };
}

function DocumentCard({ manual }: DocumentCardProps) {
    return (
        <ListView
            layout="block"
            withCenteredContents={!manual.date}
            withPadding
        >
            <Image
                withContainedFit
                src={manual.src}
                size="lg"
                className={styles.documentCover}
            />
            <Heading
                level={5}
            >
                {manual.title}
            </Heading>
            {isDefined(manual.date) && (
                <Description withLightText>
                    {manual.date}
                </Description>
            )}
        </ListView>
    );
}

export default DocumentCard;
