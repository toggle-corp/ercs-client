import { generatePath } from 'react-router';

import useAuth from '#hooks/useAuth';
import type { RouteKeys } from '#root/config/routes';
import routes from '#root/config/routes';

export interface Attrs {
    [key: string]: string | undefined;
}

function useRouteMatching(routeKey: RouteKeys, attrs?: Attrs) {
    const { isAuthenticated } = useAuth();
    const to = routes[routeKey];

    if (!to) {
        return undefined;
    }

    const {
        visibility,
        path,
    } = to;

    if (visibility === 'is-not-authenticated' && isAuthenticated) {
        return undefined;
    }

    if (visibility === 'is-authenticated' && !isAuthenticated) {
        return undefined;
    }

    return {
        to: generatePath(path ?? '/', { ...attrs }),
    };
}

export default useRouteMatching;
