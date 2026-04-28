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
import UserContext, { type UserContextInterface } from '#contexts/UserContext';
import type { MeQuery } from '#generated/types/graphql';
import useAlertContextProviderValue from '#hooks/useAlertContextProviderValue';
import {
    processError,
    processOptions,
    processResponse,
    processUrls,
} from '#utils/requestHelper';

const COOKIE_NAME = `ERCS-${import.meta.env.APP_ENVIRONMENT}-CSRFTOKEN`;
const GRAPHQL_ENDPOINT = `${import.meta.env.APP_GRAPHQL_ENDPOINT}/graphql/`;

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
        transformUrl: processUrls,
        transformOptions: processOptions,
        transformResponse: processResponse,
        transformError: processError,
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
