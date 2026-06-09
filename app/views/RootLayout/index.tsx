import {
    use,
    useEffect,
} from 'react';
import { Outlet } from 'react-router';
import { isDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import GlobalFooter from '#components/Footer';
import Navbar from '#components/Navbar';
import { api } from '#config';
import { GoContextProvider } from '#contexts/GoContext';
import UserContext from '#contexts/UserContext';
import { useMeQuery } from '#generated/types/graphql';

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

function RootLayout() {
    use(fetchHealth);
    const { setUser, setIsAuthLoading } = use(UserContext);
    const [{ fetching, data }] = useMeQuery();

    useEffect(() => {
        if (!fetching) {
            if (isDefined(data?.me)) {
                setUser(data.me);
            }
            setIsAuthLoading(false);
        }
    }, [fetching, data, setUser, setIsAuthLoading]);

    return (
        <GoContextProvider>
            <div className={styles.root}>
                <Navbar />
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
                <GlobalFooter />
            </div>
        </GoContextProvider>
    );
}

export default RootLayout;
