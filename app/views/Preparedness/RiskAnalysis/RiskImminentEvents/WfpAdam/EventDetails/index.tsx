import { useMemo } from 'react';
import {
    Container,
    ListView,
    TextOutput,
    Tooltip,
} from '@ifrc-go/ui';
import {
    getPercentage,
    maxSafe,
    resolveToString,
    roundSafe,
} from '@ifrc-go/ui/utils';
import {
    compareDate,
    isDefined,
    isFalsyString,
    isNotDefined,
    unique,
} from '@togglecorp/fujs';

import Link from '#components/Link';
import { type RiskApiResponse } from '#utils/restRequest';
import {
    isValidFeatureCollection,
    isValidPointFeature,
} from '#utils/risk';

import { type RiskEventDetailProps } from '../../../RiskImminentEventMap';

import styles from './styles.module.css';

type WfpAdamResponse = RiskApiResponse<'/api/v1/adam-exposure/'>;
type WfpAdamItem = NonNullable<WfpAdamResponse['results']>[number];
type WfpAdamExposure = RiskApiResponse<'/api/v1/adam-exposure/{id}/exposure/'>;

interface WfpAdamPopulationExposure {
    exposure_60_kmh?: number;
    exposure_90_kmh?: number;
    exposure_120_kmh?: number;
}

interface WfpAdamEventDetails {
    event_id: string;
    mag?: number;
    mmni?: number;
    url?: {
        map?: string;
        shakemap?: string;
        population?: string;
        population_csv?: string;
        wind?: string;
        rainfall?: string;
        shapefile?: string
    }
    iso3?: string;
    depth?: number;
    place?: string;
    title?: string;
    latitude?: number;
    longitude?: number;
    mag_type?: string;
    admin1_name?: string;
    published_at?: string;
    population_impact?: number;
    country?: number | null;
    alert_sent?: boolean;
    alert_level?: 'Red' | 'Orange' | 'Green' | 'Cones' | null;
    from_date?: string;
    to_date?: string;
    wind_speed?: number;
    effective_date?: string;
    date_processed?: string;
    population?: number;
    dashboard_url?: string;
    flood_area?: number;
    fl_croplnd?: number;
    source?: string;
    sitrep?: string;
}

type Props = RiskEventDetailProps<WfpAdamItem, WfpAdamExposure | undefined>;

function EventDetails(props: Props) {
    const {
        data: {
            event_details,
        },
        exposure,
        pending,
        children,
    } = props;

    const stormPoints = useMemo(
        () => {
            if (isNotDefined(exposure)) {
                return undefined;
            }

            const { storm_position_geojson } = exposure;

            const geoJson = isValidFeatureCollection(storm_position_geojson)
                ? storm_position_geojson
                : undefined;

            const points = geoJson?.features.map(
                (pointFeature) => {
                    if (
                        !isValidPointFeature(pointFeature)
                            || isNotDefined(pointFeature.properties)
                    ) {
                        return undefined;
                    }

                    const {
                        wind_speed,
                        track_date,
                    } = pointFeature.properties;

                    if (isNotDefined(wind_speed) || isFalsyString(track_date)) {
                        return undefined;
                    }

                    const date = new Date(track_date);

                    return {
                        // NOTE: using date.getTime() caused duplicate ids
                        id: track_date,
                        windSpeed: wind_speed,
                        date,
                    };
                },
            ).filter(isDefined).sort(
                (a, b) => compareDate(a.date, b.date),
            ) ?? [];

            return unique(points, (point) => point.id);
        },
        [exposure],
    );

    const eventDetails = event_details as WfpAdamEventDetails | undefined;

    // eslint-disable-next-line max-len
    const populationExposure = exposure?.population_exposure as WfpAdamPopulationExposure | undefined;

    const dashboardUrl = eventDetails?.dashboard_url ?? eventDetails?.url?.map;
    const populationImpact = roundSafe(eventDetails?.population_impact)
        ?? roundSafe(eventDetails?.population);
    const maxWindSpeed = maxSafe(
        stormPoints?.map(({ windSpeed }) => windSpeed),
    );

    // TODO: Add exposure details
    // TODO: Update stylings
    return (
        <Container
            className={styles.eventDetails}
            pending={pending}
        >
            <ListView layout="block">
                {stormPoints && stormPoints.length > 0 && isDefined(maxWindSpeed) && (
                    /* TODO: use proper svg charts */
                    <div className={styles.windSpeedChart}>
                        <div className={styles.barListContainer}>
                            {stormPoints.map(
                                (point) => (
                                    <div
                                        key={point.id}
                                        className={styles.barContainer}
                                    >
                                        <Tooltip
                                            description={resolveToString(
                                                '{point} Km/h on {pointDate}',
                                                {
                                                    point: point.windSpeed ?? '--',
                                                    pointDate: point.date.toLocaleString() ?? '--',
                                                },
                                            )}
                                        />
                                        <div
                                            style={{ height: `${getPercentage(point.windSpeed, maxWindSpeed)}%` }}
                                            className={styles.bar}
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                        <div className={styles.chartLabel}>
                            Windspeed over time
                        </div>
                    </div>
                )}
                {isDefined(eventDetails)
                    && (isDefined(eventDetails.url) || isDefined(eventDetails.dashboard_url)) && (
                    <Container
                        heading="Useful Links:"
                        headingLevel={5}
                    >
                        <ListView
                            withWrap
                            withSpacingOpticalCorrection
                            spacing="sm"
                        >
                            {isDefined(dashboardUrl) && (
                                <Link
                                    href={dashboardUrl}
                                    external
                                    withLinkIcon
                                >
                                    Dashboard
                                </Link>
                            )}
                            {isDefined(eventDetails?.url) && (
                                <>
                                    {isDefined(eventDetails.url.shakemap) && (
                                        <Link
                                            href={eventDetails?.url.shakemap}
                                            external
                                            withLinkIcon
                                        >
                                            Shakemap
                                        </Link>
                                    )}
                                    {isDefined(eventDetails.url.population) && (
                                        <Link
                                            href={eventDetails.url.population}
                                            external
                                            withLinkIcon
                                        >
                                            Population Table
                                        </Link>
                                    )}
                                    {isDefined(eventDetails.url.wind) && (
                                        <Link
                                            href={eventDetails.url.wind}
                                            external
                                            withLinkIcon
                                        >
                                            Wind
                                        </Link>
                                    )}
                                    {isDefined(eventDetails.url.rainfall) && (
                                        <Link
                                            href={eventDetails.url.rainfall}
                                            external
                                            withLinkIcon
                                        >
                                            Rainfall
                                        </Link>
                                    )}
                                    {isDefined(eventDetails.url.shapefile) && (
                                        <Link
                                            href={eventDetails.url.shapefile}
                                            external
                                            withLinkIcon
                                        >
                                            Shapefile
                                        </Link>
                                    )}
                                </>
                            )}
                        </ListView>
                    </Container>
                )}
                <div>
                    {isDefined(eventDetails?.wind_speed) && (
                        <TextOutput
                            label="Wind speed"
                            value={eventDetails?.wind_speed}
                        />
                    )}
                    {isDefined(populationImpact) && (
                        <TextOutput
                            label="People Exposed / Potentially Affected"
                            value={populationImpact}
                            valueType="number"
                            maximumFractionDigits={0}
                        />
                    )}
                </div>
                <div>
                    {isDefined(eventDetails?.source) && (
                        <TextOutput
                            label="Source"
                            value={eventDetails?.source}
                        />
                    )}
                    {isDefined(eventDetails?.sitrep) && (
                        <TextOutput
                            label="Sitrep"
                            value={eventDetails?.sitrep}
                        />
                    )}
                    {isDefined(eventDetails?.mag) && (
                        <TextOutput
                            label="Magnitude"
                            value={eventDetails?.mag}
                            valueType="number"
                        />
                    )}
                    {isDefined(eventDetails?.depth) && (
                        <TextOutput
                            label="Depth (km)"
                            value={eventDetails?.depth}
                            valueType="number"
                        />
                    )}
                    {isDefined(eventDetails?.alert_level) && (
                        <TextOutput
                            label="Alert Type"
                            value={eventDetails?.alert_level}
                        />
                    )}
                    {isDefined(eventDetails?.effective_date) && (
                        <TextOutput
                            label="Effective"
                            value={eventDetails?.effective_date}
                            valueType="date"
                        />
                    )}
                    {isDefined(eventDetails?.from_date) && (
                        <TextOutput
                            label="From date"
                            value={eventDetails?.from_date}
                            valueType="date"
                        />
                    )}
                    {isDefined(eventDetails?.to_date) && (
                        <TextOutput
                            label="To Date"
                            value={eventDetails?.to_date}
                            valueType="date"
                        />
                    )}
                </div>
                <div>
                    {isDefined(populationExposure?.exposure_60_kmh) && (
                        <TextOutput
                            label="Exposure (60km/h)"
                            value={populationExposure?.exposure_60_kmh}
                            valueType="number"
                            maximumFractionDigits={0}
                        />
                    )}
                    {isDefined(populationExposure?.exposure_90_kmh) && (
                        <TextOutput
                            label="Exposed (90km/h)"
                            value={populationExposure?.exposure_90_kmh}
                            valueType="number"
                            maximumFractionDigits={0}
                        />
                    )}
                    {isDefined(populationExposure?.exposure_120_kmh) && (
                        <TextOutput
                            label="Exposed (120km/h)"
                            value={populationExposure?.exposure_120_kmh}
                            valueType="number"
                            maximumFractionDigits={0}
                        />
                    )}
                    {isDefined(eventDetails?.flood_area) && (
                        <TextOutput
                            label="Flood Area"
                            value={eventDetails?.flood_area}
                            valueType="number"
                            suffix="hectares"
                        />
                    )}
                    {isDefined(eventDetails?.fl_croplnd) && (
                        <TextOutput
                            label="Flood Cropland"
                            value={eventDetails?.fl_croplnd}
                            valueType="number"
                            suffix="hectares"
                        />
                    )}
                </div>
                {children}
            </ListView>
        </Container>
    );
}

export default EventDetails;
