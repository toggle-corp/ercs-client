import { useState } from "react"
import { Cookies } from 'react-cookie';
import { Outlet } from 'react-router';
import { AlertContainer } from '@ifrc-go/ui';
import { AlertContext } from '@ifrc-go/ui/contexts';
import { cacheExchange } from '@urql/exchange-graphcache';
import {
    Client,
    fetchExchange,
    Provider as UrqlProvider,
} from 'urql';

import UserContext, { type UserContextInterface } from '#contexts/UserContext';
import useAlertContextProviderValue from "#hooks/useAlertContextProviderValue";

import type { User } from './types/user';

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
            'X-CSRFToken': cookies.get(COOKIE_NAME) || "taWf0Spres9M7HxChROyrQjTewfNgBds" ,
        },
        credentials: 'include',
    }),
    requestPolicy: 'cache-and-network',
    suspense: false,
});

function Root() {
    const [user, setUser] = useState<User | undefined>();
    const authenticated = !!user;
    const userContext: UserContextInterface = {
        authenticated,
        user,
        setUser,

    }
    const alertContextValue = useAlertContextProviderValue();

    return (
        <UrqlProvider value={gqlClient}>
            <UserContext.Provider value={userContext}>
                <AlertContext.Provider value={alertContextValue}>
                    <AlertContainer />
                    <Outlet />
                </AlertContext.Provider>
            </UserContext.Provider>
        </UrqlProvider>
    );
}

export default Root;
