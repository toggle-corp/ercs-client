import {
    useCallback,
    useState,
} from 'react';
import {
    CycloneIcon,
    DroughtIcon,
    EarthquakeIcon,
    FloodIcon,
    ForestFireIcon,
} from '@ifrc-go/icons';
import {
    Container,
    InfoPopup,
    LegendItem,
    ListView,
    Radio,
} from '@ifrc-go/ui';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import type { LngLatBoundsLike } from 'mapbox-gl';

import Link from '#components/Link';
import WikiLink from '#components/WikiLink';
import { environment } from '#config';
import { type components } from '#generated/riskTypes';
import { hazardTypeToColorMap } from '#utils/risk';

import Gdacs from './Gdacs';
import MeteoSwiss from './MeteoSwiss';
import Pdc from './Pdc';
import WfpAdam from './WfpAdam';

import styles from './styles.module.css';

export type ImminentEventSource = 'pdc' | 'wfpAdam' | 'gdacs' | 'meteoSwiss';
type HazardType = components['schemas']['CommonHazardTypeEnumKey'];

type BaseProps = {
    className?: string;
    title: React.ReactNode;
    bbox: LngLatBoundsLike | undefined;
    defaultSource?: ImminentEventSource;
}

type Props = BaseProps & ({
    variant: 'global';
} | {
    variant: 'region';
    regionId: number;
} | {
    variant: 'country';
    iso3: string;
})

function RiskImminentEvents(props: Props) {
    const {
        className,
        defaultSource = 'gdacs',
        ...otherProps
    } = props;
    const [activeView, setActiveView] = useState<ImminentEventSource>(defaultSource);

    const handleRadioClick = useCallback((key: ImminentEventSource) => {
        setActiveView(key);
    }, []);

    const riskHazards: Array<{
        key: HazardType,
        label: string,
        icon: React.ReactNode,
    }> = [
        {
            key: 'FL',
            label: 'Flood',
            icon: <FloodIcon />,
        },
        {
            key: 'TC',
            label: 'Storm',
            icon: <CycloneIcon />,
        },
        {
            key: 'EQ',
            label: 'Earthquake',
            icon: <EarthquakeIcon />,
        },
        {
            key: 'DR',
            label: 'Drought',
            icon: <DroughtIcon />,
        },
        {
            key: 'WF',
            label: 'Wildfire',
            icon: <ForestFireIcon />,
        },
    ];

    return (
        <Container
            className={className}
            heading="Imminent Events"
            headerDescription="This map displays information about the modelled impact of specific forecasted or detected natural hazards (floods, storms, droughts, wildfires, earthquakes). By hovering over the icons, if available, you can see the forecasted/observed footprint of the hazard; when you click on it, the table of modelled impact estimates will appear, as well as an information about who produced the impact estimate."
            withHeaderBorder
            headerActions={(
                <WikiLink
                    pathName="user_guide/risk_module#imminent-events"
                />
            )}
            footer={(
                <ListView
                    withWrap
                    withDarkBackground
                    withSpaceBetweenContents
                    withPadding
                >
                    <ListView
                        withWrap
                        spacing="sm"
                        withSpacingOpticalCorrection
                    >
                        {riskHazards.map((hazard) => (
                            <LegendItem
                                icon={hazard.icon}
                                label={hazard.label}
                                color={hazardTypeToColorMap[hazard.key]}
                                withColorInvertedIcon
                                className={styles.legendIcon}
                            />
                        ))}
                    </ListView>
                    <ListView
                        withWrap
                        spacing="sm"
                        withSpacingOpticalCorrection
                    >
                        <Radio
                            name="gdacs"
                            value={activeView === 'gdacs'}
                            onClick={handleRadioClick}
                            after={(
                                <InfoPopup
                                    title="Source: GDACS"
                                    description={resolveToComponent(
                                        'Click {here} for more information about the model and its inputs.',
                                        {
                                            here: (
                                                <Link
                                                    href="https://www.gdacs.org/default.aspx"
                                                    styleVariant="action"
                                                    external
                                                >
                                                    here
                                                </Link>
                                            ),
                                        },
                                    )}
                                />
                            )}
                        >
                            GDACS
                        </Radio>
                        <Radio
                            name="pdc"
                            value={activeView === 'pdc'}
                            onClick={handleRadioClick}
                            after={(
                                <InfoPopup
                                    title="Source: Pacific Disaster Center"
                                    description={resolveToComponent(
                                        "These impacts are produced by the Pacific Disaster Center's All-hazards Impact Model (AIM) 3.0. Click {here} for more information about the model and its inputs.",
                                        {
                                            here: (
                                                <Link
                                                    href="https://www.pdc.org/wp-content/uploads/AIM-3-Fact-Sheet-Screen-1.pdf"
                                                    styleVariant="action"
                                                    external
                                                >
                                                    here
                                                </Link>
                                            ),
                                        },
                                    )}
                                />
                            )}
                        >
                            PDC
                        </Radio>
                        {environment !== 'production' && (
                            <Radio
                                name="wfpAdam"
                                value={activeView === 'wfpAdam'}
                                onClick={handleRadioClick}
                                after={(
                                    <InfoPopup
                                        title="Source: WFP ADAM"
                                        description={resolveToComponent(
                                            'These data points are received from the WFP ADAM, which performs a 24/7 automated data harvesting, analysis and mapping of natural hazards events. Click {here} for more information.',
                                            {
                                                here: (
                                                    <Link
                                                        href="https://gis.wfp.org/adam/"
                                                        styleVariant="action"
                                                        external
                                                    >
                                                        here
                                                    </Link>
                                                ),
                                            },
                                        )}
                                    />
                                )}
                            >
                                WFP ADAM
                            </Radio>
                        )}
                        {environment !== 'production' && (
                            <Radio
                                name="meteoSwiss"
                                value={activeView === 'meteoSwiss'}
                                onClick={handleRadioClick}
                                after={(
                                    <InfoPopup
                                        title="Source: MeteoSwiss"
                                        description={(
                                            <ListView layout="block">
                                                <div>
                                                    This impact estimates are produced by
                                                    MeteoSwiss HydroMet Impact Outlook.
                                                    © 2022 MeteoSwiss. All Rights reserved.
                                                </div>
                                                <div>
                                                    {resolveToComponent(
                                                        'Disclaimer: HydroMet Impact Outlook is in a pilot phase. MeteoSwiss makes no warranty with respect to the correctness or completeness of this information. This information does not replace the advice and guidance provided by the official meteorological and hydrological services for these regions. For further information click {here}.',
                                                        {
                                                            here: (
                                                                <Link
                                                                    href="https://www.meteoswiss.admin.ch/about-us/research-and-cooperation/projects/2021/weather4un.html"
                                                                    styleVariant="action"
                                                                    external
                                                                >
                                                                    here
                                                                </Link>
                                                            ),
                                                        },
                                                    )}
                                                </div>
                                            </ListView>
                                        )}
                                    />
                                )}
                            >
                                MeteoSwiss
                            </Radio>
                        )}
                    </ListView>
                </ListView>
            )}
        >
            {activeView === 'pdc' && (
                <Pdc
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...otherProps}
                />
            )}
            {activeView === 'wfpAdam' && (
                <WfpAdam
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...otherProps}
                />
            )}
            {activeView === 'gdacs' && (
                <Gdacs
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...otherProps}
                />
            )}
            {activeView === 'meteoSwiss' && (
                <MeteoSwiss
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...otherProps}
                />
            )}
        </Container>
    );
}

export default RiskImminentEvents;
