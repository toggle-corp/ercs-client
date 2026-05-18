import React from 'react';
import { DashboardLineIcon } from '@ifrc-go/icons';
import {
    Description,
    Heading,
    Image,
    InlineLayout,
    ListView,
} from '@ifrc-go/ui';

import type { ReportsQuery } from '#generated/types/graphql';

import styles from './styles.module.css';

type Report = NonNullable<ReportsQuery['reports']>['results'][number]
type ReportCardProps = {
    report: Report;
}
function ReportCard({ report }: ReportCardProps) {
    const {
        coverImage,
        title,
        description,
    } = report;

    return (
        <InlineLayout
            before={
                coverImage?.url ? (
                    <Image
                        src={coverImage.url}
                        alt="Report"
                        size="sm"
                        withContainedFit
                        className={styles.coverImage}
                    />
                ) : (
                    <ListView
                        withCenteredContents
                        className={styles.defaultCoverImage}
                    >
                        <DashboardLineIcon
                            className={styles.dashboardIcon}
                        />
                    </ListView>
                )
            }
            contentAlignment="start"
            spacing="lg"
        >
            <ListView
                layout="block"
                spacing="3xs"
            >
                <Heading
                    level={4}
                >
                    {title}
                </Heading>
                <Description
                    withLightText
                >
                    {description}
                </Description>
            </ListView>
        </InlineLayout>
    );
}

export default ReportCard;
