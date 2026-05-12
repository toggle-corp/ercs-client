import { useMemo } from 'react';
import { Outlet } from 'react-router';

import CountryContext from '#contexts/CountryContext';
import { useRequest } from '#utils/restRequest';

const countryId = 65; // ethiopia

function PublicLayout() {
    const {
        pending: countryResponsePending,
        response: countryResponse,
    } = useRequest({
        url: '/api/v2/country/{id}/',
        pathVariables: {
            id: Number(countryId),
        },
    });

    const outletContext = useMemo(() => ({
        countryId,
        countryResponse,
        countryResponsePending,
    }), [countryResponse, countryResponsePending]);

    return (
        <CountryContext.Provider value={outletContext}>
            <Outlet />
        </CountryContext.Provider>
    );
}

export default PublicLayout;
