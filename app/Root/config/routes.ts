type Visibility = 'is-authenticated' | 'is-not-authenticated' | 'is-anything';

export interface RouteConfig {
    index?: boolean;
    path?: string;
    load: () => Promise<{ default: () => React.JSX.Element | null }>;
    visibility: Visibility;
    children?: RouteConfig[];
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
    children: [
        {
            path: 'emergency-alert',
            load: () => import('#views/Preparedness/EmergencyAlert'),
            visibility: 'is-anything',
        },
        {
            path: 'disaster-response',
            load: () => import('#views/Preparedness/DisasterResponse'),
            visibility: 'is-anything',
        },
        {
            path: 'risk-analysis',
            load: () => import('#views/Preparedness/RiskAnalysis'),
            visibility: 'is-anything',
        },
    ],
};

const dataAndReport: RouteConfig = {
    index: true,
    path: '/data-and-report',
    load: () => import('#views/DataAndReport'),
    visibility: 'is-anything',
};

const reportDetail: RouteConfig = {
    index: true,
    path: '/data-and-report/:id',
    load: () => import('#views/DataAndReport/ReportDetail'),
    visibility: 'is-anything',
};
const pmer: RouteConfig = {
    index: true,
    path: '/pmer',
    load: () => import('#views/Pmer'),
    visibility: 'is-anything',
};

const pmerDetail: RouteConfig = {
    index: true,
    path: '/pmer/:id',
    load: () => import('#views/Pmer/PmerDetail'),
    visibility: 'is-anything',
};

const capacityAndResources: RouteConfig = {
    index: true,
    path: '/capacity-and-resources',
    load: () => import('#views/CapacityAndResources'),
    visibility: 'is-anything',
};
const capacityAndResourcesDetails: RouteConfig = {
    index: true,
    path: '/capacity-and-resources/:id',
    load: () => import('#views/CapacityAndResources/CapacityAndResourcesDetails'),
    visibility: 'is-anything',
};

const ourWork: RouteConfig = {
    index: true,
    path: '/our-work',
    load: () => import('#views/OurWork'),
    visibility: 'is-anything',
    children: [
        {
            path: 'emergency-response',
            load: () => import('#views/OurWork/EmergencyResponse'),
            visibility: 'is-anything',
        },
        {
            path: 'project-mapping',
            load: () => import('#views/OurWork/ProjectMapping'),
            visibility: 'is-anything',
        },
    ],
};
const galleries: RouteConfig = {
    index: true,
    path: '/galleries',
    load: () => import('#views/Galleries'),
    visibility: 'is-authenticated',
};

const galleryAlbum: RouteConfig = {
    index: true,
    path: '/galleries/:id',
    load: () => import('#views/Galleries/AlbumDetail'),
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
    load: () => import('#views/TeamList/Members'),
    visibility: 'is-authenticated',
};

const teamList: RouteConfig = {
    index: true,
    path: '/teams',
    load: () => import('#views/TeamList'),
    visibility: 'is-authenticated',
};

const login: RouteConfig = {
    index: true,
    path: '/login',
    load: () => import('#views/Login'),
    visibility: 'is-not-authenticated',
};

const additionalLinks: RouteConfig = {
    index: true,
    path: '/additional-links',
    load: () => import('#views/AdditionalLinks'),
    visibility: 'is-anything',
};

const manuals: RouteConfig = {
    index: true,
    path: '/manuals',
    load: () => import('#views/Documents/Manuals'),
    visibility: 'is-anything',
};

const policies: RouteConfig = {
    index: true,
    path: '/policies',
    load: () => import('#views/Documents/Policies'),
    visibility: 'is-anything',
};

const guidelines: RouteConfig = {
    index: true,
    path: '/guidelines',
    load: () => import('#views/Documents/Guidelines'),
    visibility: 'is-anything',
};

const onlineInteractive: RouteConfig = {
    index: true,
    path: '/online-interactive',
    load: () => import('#views/Documents/OnlineInteractive'),
    visibility: 'is-anything',
};

function child(route: RouteConfig, path: string): RouteConfig {
    const found = route.children?.find((c) => c.path === path);
    if (!found) throw new Error(`Child route "${path}" not found in "${route.path}"`);
    return {
        ...found,
        path: `${route.path}/${path}`,
    };
}

const routes = {
    home,
    ourWork,
    preparedness,
    dataAndReport,
    pmer,
    pmerDetail,
    galleries,
    galleryAlbum,
    capacityAndResources,
    termsAndConditions,
    cookie,
    team,
    teamList,
    login,
    reportDetail,
    capacityAndResourcesDetails,
    additionalLinks,
    manuals,
    guidelines,
    onlineInteractive,
    policies,
    // child routes
    emergencyAlert: child(preparedness, 'emergency-alert'),
    disasterResponse: child(preparedness, 'disaster-response'),
    riskAnalysis: child(preparedness, 'risk-analysis'),
    emergencyResponse: child(ourWork, 'emergency-response'),
    projectMapping: child(ourWork, 'project-mapping'),

} satisfies Record<string, RouteConfig>;

export type RouteKeys = keyof typeof routes;

export default routes;
