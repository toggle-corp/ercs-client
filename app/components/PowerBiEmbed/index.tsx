import {
    useMemo,
    useState,
} from 'react';
import { isFalsyString } from '@togglecorp/fujs';
import type { IReportEmbedConfiguration } from 'powerbi-client';
import { models } from 'powerbi-client';
import { PowerBIEmbed as PowerBI } from 'powerbi-client-react';
import type { ICustomEvent } from 'service';

import styles from './styles.module.css';

const VALID_EMBED_HOSTNAME_SUFFIXES = [
    'powerbi.com',
    'powerbigov.us',
    'powerbi.cn',
];

function isValidEmbedUrl(embedUrl: string) {
    if (isFalsyString(embedUrl)) {
        return false;
    }

    try {
        const parsed = new URL(embedUrl);
        return parsed.protocol === 'https:'
            && VALID_EMBED_HOSTNAME_SUFFIXES.some(
                (suffix) => parsed.hostname === suffix || parsed.hostname.endsWith(`.${suffix}`),
            );
    } catch {
        return false;
    }
}

interface Props {
    embedUrl: string;
}

function PowerBIEmbed(props: Props) {
    const { embedUrl } = props;

    // Track which url errored so a new url gets a fresh attempt
    const [erroredUrl, setErroredUrl] = useState<string>();

    const embedConfig: IReportEmbedConfiguration = useMemo(() => ({
        type: 'report',
        embedUrl,
        id: undefined,
        accessToken: undefined,
        tokenType: models.TokenType.Embed,
        settings: {
            panes: {
                filters: { visible: false },
            },
            layoutType: models.LayoutType.Custom,
            customLayout: {
                displayOption: models.DisplayOption.FitToWidth,
            },
            navContentPaneEnabled: true,
        },
    }), [embedUrl]);

    const eventHandlers = useMemo(() => new Map([
        ['error', (event?: ICustomEvent<models.IError>) => {
            // eslint-disable-next-line no-console
            console.error('PowerBI embed error:', event?.detail);
            setErroredUrl(embedUrl);
        }],
    ]), [embedUrl]);

    if (!isValidEmbedUrl(embedUrl) || erroredUrl === embedUrl) {
        return (
            <div className={styles.embedError}>
                Unable to load this dashboard. The embed link is missing or invalid.
            </div>
        );
    }

    return (
        <PowerBI
            embedConfig={embedConfig}
            cssClassName={styles.embed}
            eventHandlers={eventHandlers}
        />
    );
}

export default PowerBIEmbed;
