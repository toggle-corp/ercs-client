/* eslint-disable no-console */
import type { IReportEmbedConfiguration } from 'powerbi-client';
import { models } from 'powerbi-client';
import { PowerBIEmbed as PowerBI } from 'powerbi-client-react';
import type { ICustomEvent } from 'service';

import styles from './styles.module.css';

function PowerBIEmbed({ embedUrl }: { embedUrl: string }) {
    const embedConfig: IReportEmbedConfiguration = {
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
    };

    return (
        <PowerBI
            embedConfig={embedConfig}
            cssClassName={styles.embed}
            eventHandlers={
                new Map([
                    ['loaded', () => console.log('Report loaded')],
                    ['rendered', () => console.log('Report rendered')],
                    ['error', (event?: ICustomEvent<models.IError>) => console.error('Error:', event?.detail)],
                ])
            }
        />
    );
}

export default PowerBIEmbed;
