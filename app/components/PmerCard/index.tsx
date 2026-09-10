import { DocumentPdfLineIcon } from '@ifrc-go/icons';
import {
    DateOutput,
    Description,
    Heading,
    InlineLayout,
    ListView,
} from '@ifrc-go/ui';
import { isTruthyString } from '@togglecorp/fujs';

import { type PmerReportsQuery } from '#generated/types/graphql';

import styles from './styles.module.css';

export type PmerReport = NonNullable<PmerReportsQuery['pmerReports']>['results'][number];

type PmerCardProps = {
    report: PmerReport;
}

function PmerCard({ report }: PmerCardProps) {
    const {
        title,
        description,
        reportTypeDisplay,
        region,
        department,
        project,
        createdAt,
    } = report;

    const meta = [
        region?.name ?? 'National',
        reportTypeDisplay,
        department,
        project,
    ].filter(isTruthyString);

    return (
        <InlineLayout
            className={styles.pmerCard}
            before={(
                <ListView
                    withCenteredContents
                    className={styles.cover}
                >
                    <DocumentPdfLineIcon
                        className={styles.coverIcon}
                    />
                </ListView>
            )}
            contentAlignment="center"
            spacing="md"
        >
            <ListView
                layout="block"
                spacing="2xs"
            >
                <Heading
                    level={5}
                >
                    {title}
                </Heading>
                {isTruthyString(description) && (
                    <Description
                        withLightText
                        textSize="sm"
                        className={styles.description}
                    >
                        {description}
                    </Description>
                )}
                <Description
                    withLightText
                    textSize="sm"
                >
                    {meta.join(' · ')}
                    {' · '}
                    <DateOutput
                        value={createdAt}
                        format="MMM yyyy"
                    />
                </Description>
            </ListView>
        </InlineLayout>
    );
}

export default PmerCard;
