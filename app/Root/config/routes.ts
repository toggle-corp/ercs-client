type Visibility = 'is-authenticated' | 'is-not-authenticated' | 'is-anything';

export interface RouteConfig {
    index?: boolean;
    path?: string;
    load: () => Promise<{ default: () => React.JSX.Element | null }>;
    visibility: Visibility;
}

const home: RouteConfig = {
    index: true,
    path: '/',
    load: () => import('#views/Home'),
    visibility: 'is-anything',
};

const preparedness: RouteConfig = {
    index: true,
    path: '/preparedness',
    load: () => import('#views/Preparedness'),
    visibility: 'is-anything',
};
const dataAndReport: RouteConfig = {
    index: true,
    path: '/data-and-report',
    load: () => import('#views/DataAndReport'),
    visibility: 'is-anything',
};
const capacityAndResources: RouteConfig = {
    index: true,
    path: '/capacity-and-resources',
    load: () => import('#views/Home'),
    visibility: 'is-anything',
};
const ourWork: RouteConfig = {
    index: true,
    path: '/our-work',
    load: () => import('#views/OurWork'),
    visibility: 'is-anything',
};
const galleries: RouteConfig = {
    index: true,
    path: '/galleries',
    load: () => import('#views/Galleries'),
    visibility: 'is-authenticated',
};

const termsAndConditions: RouteConfig = {
    index: true,
    path: '/terms-and-conditions',
    load: () => import('#views/Home'),
    visibility: 'is-anything',
};
const cookie: RouteConfig = {
    index: true,
    path: '/cookies-policy',
    load: () => import('#views/Home'),
    visibility: 'is-anything',
};

const team: RouteConfig = {
    index: true,
    path: '/team/:id',
    load: () => import('#views/Team'),
    visibility: 'is-authenticated',
};

const login: RouteConfig = {
    index: true,
    path: '/login',
    load: () => import('#views/Login'),
    visibility: 'is-not-authenticated',
};

const routes = {
    home,
    ourWork,
    preparedness,
    dataAndReport,
    galleries,
    capacityAndResources,
    termsAndConditions,
    cookie,
    team,
    login,
};

export type RouteKeys = keyof typeof routes;

export default routes;
