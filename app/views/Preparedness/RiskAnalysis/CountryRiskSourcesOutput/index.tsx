import { Fragment } from 'react';
import { TextOutput } from '@ifrc-go/ui';
import { resolveToComponent } from '@ifrc-go/ui/utils';

import Link from '#components/Link';

function CountryRiskSourcesOutput() {
    const riskByMonthSources = [
        {
            key: 'inform',
            link: 'https://drmkc.jrc.ec.europa.eu/inform-index/INFORM-Risk',
            label: 'INFORM',
            description: "{link} for each country's level of risk",
        },
        {
            key: 'undrr',
            link: 'https://www.undrr.org/',
            label: 'UNDRR',
            description: '{link} for the population exposure',
        },
        {
            key: 'idmc',
            link: 'https://www.internal-displacement.org/',
            label: 'IDMC',
            description: '{link} for the expected displacements',
        },
        {
            key: 'ipc',
            link: 'https://www.ipcinfo.org/',
            label: 'IPC',
            description: '{link} for food insecurity',
        },
    ];

    return (
        <TextOutput
            label="Source"
            value={
                riskByMonthSources.map((source, i) => (
                    <Fragment key={source.key}>
                        {resolveToComponent(
                            source.description,
                            {
                                link: (
                                    <Link
                                        styleVariant="action"
                                        href={source.link}
                                        external
                                        withUnderline
                                    >
                                        {source.label}
                                    </Link>
                                ),
                            },
                        )}
                        {i < (riskByMonthSources.length - 1) && <br />}
                    </Fragment>
                ))
            }
        />
    );
}

export default CountryRiskSourcesOutput;
