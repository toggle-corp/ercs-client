// import {
//     use,
//     useEffect,
//     useState,
// } from 'react';
import {
    use,
    useEffect,
    useState
} from 'react'
import { Outlet } from 'react-router';
import { isDefined } from '@togglecorp/fujs';
import { gql } from 'urql';

import UserContext from '#contexts/UserContext';
// import { isDefined } from '@togglecorp/fujs';
// import { gql } from 'urql';
// import PreloadMessage from '#components/PreloadMessage';
// import UserContext from '#contexts/UserContext';
import { useMeQuery } from '#generated/types/graphql';

import styles from './styles.module.css';

// const fetchHealth = fetch(`${import.meta.env.APP_GRAPHQL_ENDPOINT}/health-check/?format=json`, {
//     method: 'GET',
//     credentials: 'include',
// })
//     .then((res) => res.json());

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
    const { setUser } = use(UserContext);
    const [ready, setReady] = useState(false);

    // const healthCheck = use(fetchHealth);

    const [{ fetching, data }] = useMeQuery();

    useEffect(() => {
        if (  fetching) {
            return;
        }
        if (isDefined(data?.me)) {
            const fullName = data.me.fullName || '';
            const [firstName, ...lastNameParts] = fullName.split(' ');
            const lastName = lastNameParts.join(' ');
            setUser({
                ...data.me,
                firstName,
                lastName,
            });
        } else {
            setUser(undefined);
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReady(true);
    }, [ fetching, data, setUser]);

    if (!ready) {
        return (
            <div>
                Checking user session...
            </div>
        );
    }
    return (
        <div className={styles.root}>
            <Outlet />
        </div>
    );
}

export default RootLayout;
