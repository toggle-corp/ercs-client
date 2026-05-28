import {
    use,
    useMemo,
} from 'react';
import { isDefined } from '@togglecorp/fujs';

import UserContext from '#contexts/UserContext';

function useAuth() {
    const { user, isAuthLoading } = use(UserContext);

    const isAuthenticated = isDefined(user);

    return useMemo(
        () => ({ isAuthenticated, isAuthLoading }),
        [isAuthenticated, isAuthLoading],
    );
}

export default useAuth;
