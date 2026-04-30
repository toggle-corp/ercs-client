import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router';
import mapboxgl from 'mapbox-gl';

import type { RouteConfig } from '#root/config/routes.ts';
import routes from '#root/config/routes.ts';
import PageError from '#views/PageError/index.tsx';

const privateRoutes = Object.values(routes).filter(
    ({ visibility }) => visibility === 'is-authenticated',
);

const publicRoutes = Object.values(routes).filter(
    ({ visibility }) => visibility === 'is-anything',
);

const guestRoutes = Object.values(routes).filter(
    ({ visibility }) => visibility === 'is-not-authenticated',
);

function mapRoute(routeConfig: RouteConfig) {
    return {
        index: routeConfig.index,
        path: routeConfig.path,
        lazy: async () => {
            const { default: Component } = await routeConfig.load();
            return { Component };
        },
    };
}

mapboxgl.accessToken = import.meta.env.APP_MAPBOX_TOKEN ?? '';
mapboxgl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    // eslint-disable-next-line no-console
    (err) => { console.error(err); },
    true,
);

const router = createBrowserRouter([
    {
        errorElement: <PageError />,
        lazy: async () => {
            const { default: Component } = await import('./Root/index.tsx');
            return { Component };
        },
        children: [
            {
                lazy: async () => {
                    const { default: Component } = await import('./views/RootLayout/index.tsx');
                    return { Component };
                },
                children: [
                    {
                        lazy: async () => {
                            const { default: Component } = await import('./views/GuestLayout/index.tsx');
                            return { Component };
                        },
                        children: guestRoutes.map(mapRoute),
                    },
                    {
                        lazy: async () => {
                            const { default: Component } = await import('./views/PrivateLayout/index.tsx');
                            return { Component };
                        },
                        children: privateRoutes.map(mapRoute),
                    },
                    {
                        lazy: async () => {
                            const { default: Component } = await import('./views/PublicLayout/index.tsx');
                            return { Component };
                        },
                        children: publicRoutes.map(mapRoute),
                    },
                ],
            },
        ],
    // FIXME: add error element
    // errorElement:
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
