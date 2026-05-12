import { useMemo } from 'react';
import {
    ChartPoint,
    TextOutput,
    Tooltip,
} from '@ifrc-go/ui';
import { isDefined } from '@togglecorp/fujs';

const currentYear = new Date().getFullYear();

interface Props {
    className?: string;
    dataPoint: {
        originalData: {
            year?: number;
            month: number;
            analysis_date?: string;
            total_displacement: number;
        },
        key: number | string;
        x: number;
        y: number;
    };
}

function FiChartPoint(props: Props) {
    const {
        dataPoint: {
            x,
            y,
            originalData,
        },
        className,
    } = props;

    const title = useMemo(
        () => {
            const {
                year,
                month,
            } = originalData;

            if (isDefined(year)) {
                return new Date(year, month - 1, 1).toLocaleString(
                    navigator.language,
                    {
                        year: 'numeric',
                        month: 'long',
                    },
                );
            }

            const formattedMonth = new Date(currentYear, month - 1, 1).toLocaleString(
                navigator.language,
                { month: 'long' },
            );

            return `Average for ${formattedMonth}`;
        },
        [originalData],
    );

    return (
        <ChartPoint
            className={className}
            x={x}
            y={y}
        >
            <Tooltip
                title={title}
                description={(
                    <>
                        {isDefined(originalData.analysis_date) && (
                            <TextOutput
                                label="Analysis date"
                                value={originalData.analysis_date}
                                valueType="date"
                            />
                        )}
                        <TextOutput
                            label="People Exposed"
                            value={originalData.total_displacement}
                            valueType="number"
                            maximumFractionDigits={0}
                        />
                    </>
                )}
            />
        </ChartPoint>
    );
}

export default FiChartPoint;
