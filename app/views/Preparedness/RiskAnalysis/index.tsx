import { useMemo } from 'react';
import {
    Container,
    Description,
    ListView,
} from '@ifrc-go/ui';
import {
    isDefined,
    isNotDefined,
    mapToList,
} from '@togglecorp/fujs';

import Link from '#components/Link';
import WikiLink from '#components/WikiLink';
import useGoContext from '#hooks/useGoContext';
import useInputState from '#hooks/useInputState';
import { multiMonthSelectDefaultValue } from '#utils/constants';
import { getGeoJsonBounds } from '#utils/geo';
import { useRiskRequest } from '#utils/restRequest';

import CountryRiskSourcesOutput from './CountryRiskSourcesOutput';
import MultiMonthSelectInput from './MultiMonthSelectInput';
import PossibleEarlyActionTable from './PossibleEarlyActionTable';
import ReturnPeriodTable from './ReturnPeriodTable';
import RiskBarChart from './RiskBarChart';
import RiskImminentEvents, { type ImminentEventSource } from './RiskImminentEvents';
import RiskTable from './RiskTable';

import styles from './styles.module.css';

function getCurrentMonth() {
    return new Date().getMonth();
}

function RiskAnalysis() {
    const { countryResponse, countryId } = useGoContext();
    const [
        selectedMonths,
        setSelectedMonths,
    ] = useInputState<(typeof multiMonthSelectDefaultValue) | undefined>({
        ...multiMonthSelectDefaultValue,
        [getCurrentMonth()]: true,
    });

    const {
        pending: pendingCountryRiskResponse,
        response: countryRiskResponse,
    } = useRiskRequest({
        apiType: 'risk',
        url: '/api/v1/country-seasonal/',
        query: {
            // FIXME: why do we need to use lowercase?
            iso3: countryResponse?.iso3?.toLowerCase(),
        },
    });

    const {
        pending: pendingImminentEventCounts,
        response: imminentEventCountsResponse,
    } = useRiskRequest({
        apiType: 'risk',
        url: '/api/v1/country-imminent-counts/',
        query: {
            iso3: countryResponse?.iso3?.toLowerCase(),
        },
    });

    const hasImminentEvents = useMemo(
        () => {
            if (isNotDefined(imminentEventCountsResponse)) {
                return false;
            }

            const eventCounts = mapToList(
                imminentEventCountsResponse,
                (value) => value,
            ).filter(isDefined).filter(
                (value) => value > 0,
            );

            return eventCounts.length > 0;
        },
        [imminentEventCountsResponse],
    );

    const defaultImminentEventSource = useMemo<ImminentEventSource | undefined>(
        () => {
            if (isNotDefined(imminentEventCountsResponse)) {
                return undefined;
            }

            const {
                pdc,
                adam,
                gdacs,
                meteoswiss,
            } = imminentEventCountsResponse;

            if (isDefined(pdc) && pdc > 0) {
                return 'pdc';
            }

            if (isDefined(adam) && adam > 0) {
                return 'wfpAdam';
            }

            if (isDefined(gdacs) && gdacs > 0) {
                return 'gdacs';
            }

            if (isDefined(meteoswiss) && meteoswiss > 0) {
                return 'meteoSwiss';
            }

            return undefined;
        },
        [imminentEventCountsResponse],
    );

    // NOTE: we always get 1 child in the response
    const riskResponse = countryRiskResponse?.[0];
    const bbox = useMemo(() => (
        (countryResponse && countryResponse.bbox)
            ? getGeoJsonBounds(countryResponse.bbox)
            : undefined
    ), [countryResponse]);

    return (
        <Container
            pending={pendingImminentEventCounts}
            headerDescription={(
                <Description withCenteredContent>
                    The following dataset displays information about the
                    modeled impact of specific forecasted or detected natural hazards.
                </Description>
            )}
            headerActions={(
                <WikiLink
                    className={styles.wikiLink}
                    pathName="user_guide/Country_Pages#risk-watch"

                />
            )}
        >
            <ListView
                layout="block"
                spacing="3xl"
            >
                {hasImminentEvents
                && isDefined(countryResponse)
                && isDefined(countryResponse.iso3)
                && (
                    <RiskImminentEvents
                        variant="country"
                        iso3={countryResponse.iso3}
                        title={countryResponse.name}
                        bbox={bbox}
                        defaultSource={defaultImminentEventSource}
                    />
                )}
                <Container
                    heading="Risks by Month"
                    headerDescription={(
                        <>
                            The table below displays available information about specific
                            disaster risks for each month. When you move the slider
                            from month to month, the information will update automatically.
                            Hold Shift to select a range of months — this will display the
                            cumulative number of people exposed and at risk of displacement.
                            Selecting Yearly Avg will display the annual figures from
                            INFORM and the total number of people exposed and at
                            risk of being displaced per country per year.
                        </>
                    )}
                    withHeaderBorder
                    footerActions={<CountryRiskSourcesOutput />}
                >
                    <ListView layout="block">
                        <MultiMonthSelectInput
                            name={undefined}
                            value={selectedMonths}
                            onChange={setSelectedMonths}
                        />
                        <RiskTable
                            riskData={riskResponse}
                            selectedMonths={selectedMonths}
                            dataPending={pendingCountryRiskResponse}
                        />
                    </ListView>
                </Container>
                <Container
                    className={styles.eapContainer}
                    heading="Early Action Protocols (EAPs)"
                    withHeaderBorder
                    headerActions={(
                        <Link
                            href="https://www.ifrc.org/appeals?date_from=&date_to=&type%5B%5D=30&appeal_code=&text="
                            external
                            withLinkIcon
                            colorVariant="primary"
                            styleVariant="filled"
                            spacing="3xs"
                        >
                            Download the EAP
                        </Link>
                    )}
                    spacing="lg"
                    withShadow
                    withPadding
                    withBackground
                >
                    EAPs are a formal plan that guide timely and effective implementation
                    of early actions for extreme weather events, based on pre-agreed triggers.
                </Container>
                <RiskBarChart
                    pending={pendingCountryRiskResponse}
                    seasonalRiskData={riskResponse}
                />
                <PossibleEarlyActionTable
                    countryId={Number(countryId)}
                    countryResponse={countryResponse}
                />
                <ReturnPeriodTable
                    data={riskResponse?.return_period_data}
                />
            </ListView>
        </Container>
    );
}

export default RiskAnalysis;
