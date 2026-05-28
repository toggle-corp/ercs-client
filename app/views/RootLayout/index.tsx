import {
    use,
    useEffect,
    useMemo,
} from 'react';
import { Outlet } from 'react-router';
import { isDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import GlobalFooter from '#components/Footer';
import Navbar from '#components/Navbar';
import { api } from '#config';
import GoContext from '#contexts/GoContext';
import UserContext from '#contexts/UserContext';
import { useMeQuery } from '#generated/types/graphql';
import { useRequest } from '#utils/restRequest';

import styles from './styles.module.css';

const fetchHealth = fetch(`${api}/health-check/?format=json`, {
    method: 'GET',
    credentials: 'include',
})
    .then((res) => res.json());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ME_QUERY = gql`
    query Me {
        me {
    role
    regionId
    mfaEnabled
    isActive
    id
    fullName
    email
    createdAt
  }
    }
`;
const countryId = 65; // ethiopia

function RootLayout() {
    use(fetchHealth);
    const { setUser, setIsAuthLoading } = use(UserContext);
    const [{ fetching, data }] = useMeQuery();

    const {
        pending: countryResponsePending,
        response: countryResponse,
    } = useRequest({
        url: '/api/v2/country/{id}/',
        preserveResponse: true,
        pathVariables: {
            id: Number(countryId),
        },
    });

    const {
        response: disasterTypes,
        pending: disasterTypesPending,
    } = useRequest(
        {
            url: '/api/v2/disaster_type/',
            preserveResponse: true,
        },
    );

    const {
        response: globalEnums,
        pending: globalEnumsPending,
    } = useRequest({
        url: '/api/v2/global-enums/',
        preserveResponse: true,
    });

    const GoContextValue = useMemo(() => ({
        countryId,
        countryResponse,
        countryResponsePending,
        disasterTypes,
        disasterTypesPending,
        globalEnums,
        globalEnumsPending,
    }), [
        countryResponse,
        countryResponsePending,
        disasterTypesPending,
        disasterTypes,
        globalEnums,
        globalEnumsPending,
    ]);

    useEffect(() => {
        if (!fetching) {
            if (isDefined(data?.me)) {
                setUser(data.me);
            }
            setIsAuthLoading(false);
        }
    }, [fetching, data, setUser, setIsAuthLoading]);

    return (
        <GoContext.Provider value={GoContextValue}>
            <div className={styles.root}>
                <Navbar />
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
                <GlobalFooter />
            </div>
        </GoContext.Provider>
    );
}

export default RootLayout;
