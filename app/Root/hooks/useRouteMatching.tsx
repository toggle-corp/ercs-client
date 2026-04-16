import { use } from 'react';
import { generatePath } from 'react-router';

import UserContext from '#contexts/UserContext';
import type { RouteKeys } from '#root/config/routes';
import routes from '#root/config/routes';

export interface Attrs {
    [key: string]: string | number | undefined;
}

function useRouteMatching(routeKey: RouteKeys, attrs?: Attrs) {
    const { authenticated } = use(UserContext);

    const route = routes[routeKey];

    if (!route) {
        return undefined;
    }

    const {
        visibility,
        path,
    } = route;

    if (visibility === 'is-not-authenticated' && authenticated) {
        return undefined;
    }

    if (visibility === 'is-authenticated' && !authenticated) {
        return undefined;
    }

    return {
        to: generatePath(path ?? '/', { ...attrs }),
    };
}

export default useRouteMatching;
