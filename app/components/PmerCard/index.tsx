import { DocumentPdfLineIcon } from '@ifrc-go/icons';
import {
    DateOutput,
    Description,
    Heading,
    InlineLayout,
    ListView,
} from '@ifrc-go/ui';
import { isDefined } from '@togglecorp/fujs';

import { type PmerReportsQuery } from '#generated/types/graphql';

import styles from './styles.module.css';

export type PmerReport = NonNullable<PmerReportsQuery['pmerReports']>['results'][number];

type PmerCardProps = {
    report: PmerReport;
}

function PmerCard({ report }: PmerCardProps) {
    const {
        title,
        reportTypeDisplay,
        region,
        createdAt,
    } = report;

    const meta = [
        region?.name ?? 'National',
        reportTypeDisplay,
    ].filter(isDefined);

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
