import {
    Suspense,
    useMemo,
    useState,
} from 'react';
import { Cookies } from 'react-cookie';
import { Outlet } from 'react-router';
import { AlertContainer } from '@ifrc-go/ui';
import { AlertContext } from '@ifrc-go/ui/contexts';
import { RequestContext } from '@togglecorp/toggle-request';
import { cacheExchange } from '@urql/exchange-graphcache';
import {
    Client,
    fetchExchange,
    Provider as UrqlProvider,
} from 'urql';

import PreloadMessage from '#components/PreloadMessage';
import {
    api,
    environment,
} from '#config';
import UserContext, { type UserContextInterface } from '#contexts/UserContext';
import type { MeQuery } from '#generated/types/graphql';
import useAlertContextProviderValue from '#hooks/useAlertContextProviderValue';
import {
    processGoError,
    processGoOptions,
    processGoResponse,
    processGoUrls,
} from '#utils/restRequest/go';

const COOKIE_NAME = `ERCS-${environment}-CSRFTOKEN`;
const GRAPHQL_ENDPOINT = `${api}/graphql/`;

const cookies = new Cookies();
const gqlClient = new Client({
    url: GRAPHQL_ENDPOINT,
    exchanges: [
        cacheExchange({}),
        fetchExchange,
    ],
    fetchOptions: () => ({
        headers: {
            'X-CSRFToken': cookies.get(COOKIE_NAME),
        },
        credentials: 'include',
    }),
    requestPolicy: 'cache-and-network',
    suspense: false,
});

function Root() {
    const [user, setUser] = useState<MeQuery['me'] | undefined>();
    const authenticated = !!user;
    const userContext: UserContextInterface = useMemo(() => ({
        authenticated,
        user,
        setUser,
    }), [authenticated, user]);

    const requestContextValue = useMemo(() => ({
        transformUrl: processGoUrls,
        transformOptions: processGoOptions,
        transformResponse: processGoResponse,
        transformError: processGoError,
    }), []);
    const alertContextValue = useAlertContextProviderValue();

    return (
        <UrqlProvider value={gqlClient}>
            <RequestContext.Provider value={requestContextValue}>
                <UserContext.Provider value={userContext}>
                    <AlertContext.Provider value={alertContextValue}>
                        <AlertContainer />
                        <Suspense
                            fallback={(
                                <PreloadMessage>
                                    loading...
                                </PreloadMessage>
                            )}
                        >
                            <Outlet />
                        </Suspense>
                    </AlertContext.Provider>
                </UserContext.Provider>
            </RequestContext.Provider>

        </UrqlProvider>
    );
}

export default Root;
