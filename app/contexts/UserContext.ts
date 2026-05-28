import { createContext } from 'react';

import type { MeQuery } from '#generated/types/graphql';

export interface UserContextInterface {
    user: MeQuery['me'] | undefined;
    setUser: React.Dispatch<React.SetStateAction<MeQuery['me'] | undefined>>;
    removeUserAuth: () => void;
    isAuthLoading: boolean;
    setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextInterface>({
    user: undefined,
    setUser: () => {
        // eslint-disable-next-line no-console
        console.error('setUser called on UserContext without a provider');
    },
    removeUserAuth: () => {
        // eslint-disable-next-line no-console
        console.warn('UserContext::removeUser called without provider');
    },
    isAuthLoading: false,
    setIsAuthLoading: () => {
        // eslint-disable-next-line no-console
        console.warn('UserContext::setIsAuthLoading called without provider');
    },
});

export default UserContext;
