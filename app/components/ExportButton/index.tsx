import { DownloadTwoLineIcon } from '@ifrc-go/icons';
import {
    Button,
    NumberOutput,
} from '@ifrc-go/ui';
import { resolveToComponent } from '@ifrc-go/ui/utils';

interface Props {
    onClick: () => void;
    disabled?: boolean;
    progress?: number;
    pendingExport: boolean;
    totalCount: number | undefined;
}

function ExportButton(props: Props) {
    const {
        onClick,
        disabled,
        progress,
        pendingExport,
        totalCount = 0,
    } = props;
    const getExportLabel = () => {
        if (!pendingExport) return 'Export';

        if (progress != null) {
            return resolveToComponent('Downloading... ({progress}%)', {
                progress: (
                    <NumberOutput
                        value={progress * 100}
                        maximumFractionDigits={0}
                    />
                ),
            });
        }

        return 'Downloading...';
    };

    return (
        <Button
            name={undefined}
            onClick={onClick}
            before={<DownloadTwoLineIcon />}
            disabled={totalCount < 1 || pendingExport || disabled}
        >
            {getExportLabel()}
        </Button>
    );
}

export default ExportButton;
