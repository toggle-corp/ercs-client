import type {
    CircleLayer,
    CirclePaint,
} from 'mapbox-gl';

import {
    COLOR_BLACK,
    COLOR_BLUE,
    COLOR_ORANGE,
    COLOR_RED,
    COLOR_YELLOW,
} from '#utils/constants';

import type {
    AppealListItem,
    AppealTypeOption,
} from './type';

export const COLOR_EMERGENCY_APPEAL = COLOR_RED;
export const COLOR_DREF = COLOR_YELLOW;
export const COLOR_EAP = COLOR_BLUE;
export const COLOR_MULTIPLE_TYPES = COLOR_ORANGE;

// FIXME: these must be a constant defined somewhere else
export const APPEAL_TYPE_DREF = 0;
export const APPEAL_TYPE_EMERGENCY = 1;
// const APPEAL_TYPE_INTERNATIONAL = 2; // TODO: we are not showing this?
export const APPEAL_TYPE_EAP = 3;
export const APPEAL_TYPE_MULTIPLE = -1;

const circleColor: CirclePaint['circle-color'] = [
    'match',
    ['get', 'appealType'],
    APPEAL_TYPE_DREF,

    COLOR_DREF,
    APPEAL_TYPE_EMERGENCY,
    COLOR_EMERGENCY_APPEAL,
    APPEAL_TYPE_EAP,
    COLOR_EAP,
    APPEAL_TYPE_MULTIPLE,
    COLOR_MULTIPLE_TYPES,
    COLOR_BLACK,
];
const basePointPaint: CirclePaint = {
    'circle-radius': 5,
    'circle-color': circleColor,
    'circle-opacity': 0.8,
};

export const basePointLayerOptions: Omit<CircleLayer, 'id'> = {
    type: 'circle',
    paint: basePointPaint,
};

const baseOuterCirclePaint: CirclePaint = {
    'circle-color': circleColor,
    'circle-opacity': 0.4,
};

const outerCirclePaintForFinancialRequirements: CirclePaint = {
    ...baseOuterCirclePaint,
    'circle-radius': [
        'interpolate',
        ['linear', 1],
        ['get', 'financialRequirements'],
        1000,
        7,
        10000,
        9,
        100000,
        11,
        1000000,
        15,
    ],
};

const outerCirclePaintForPeopleTargeted: CirclePaint = {
    ...baseOuterCirclePaint,
    'circle-radius': [
        'interpolate',
        ['linear', 1],
        ['get', 'peopleTargeted'],
        1000,
        7,
        10000,
        9,
        100000,
        11,
        1000000,
        15,
    ],
};

export const outerCircleLayerOptionsForFinancialRequirements: Omit<CircleLayer, 'id'> = {
    type: 'circle',
    paint: outerCirclePaintForFinancialRequirements,
};

export const outerCircleLayerOptionsForPeopleTargeted: Omit<CircleLayer, 'id'> = {
    type: 'circle',
    paint: outerCirclePaintForPeopleTargeted,
};

export interface ScaleOption {
    label: string;
    value: 'financialRequirements' | 'peopleTargeted';
}

export function optionKeySelector(option: ScaleOption) {
    return option.value;
}

export function optionLabelSelector(option: ScaleOption) {
    return option.label;
}

export const EthiopiaCountryData = {
    iso: 'ET',
    iso3: 'ETH',
    society_url: 'http://www.redcrosseth.org/',
    region: 0,
    key_priorities: null,
    inform_score: null,
    id: 65,
    url_ifrc: 'https://www.ifrc.org/national-societies-directory/ethiopian-red-cross-society',
    record_type: 1,
    record_type_display: 'Country',
    bbox: {
        type: 'Polygon',
        coordinates: [
            [
                [
                    41.08749389076502,
                    0.021048236623353,
                ],
                [
                    48.00201415347367,
                    8.006641317439508,
                ],
                [
                    38.340911859897744,
                    16.34780593622264,
                ],
                [
                    31.42501830617139,
                    8.339226238130758,
                ],
                [
                    41.08749389076502,
                    0.021048236623353,
                ],
            ],
        ],
    },
    centroid: {
        type: 'Point',
        coordinates: [
            39.655151361666455,
            8.559294026448153,
        ],
    },
    independent: true,
    is_deprecated: false,
    fdrs: 'DET001',
    links: [],
    address_1: 'Ras Desta Damtew Avenue',
    address_2: 'P.O. Box 195',
    city_code: 'Addis Ababa',
    phone: '(251) 115 15 90 74 / 115 51 91 44 / 115 51 91 71',
    website: 'http://www.redcrosseth.org',
    emails: [
        'ercsinfo@redcrosseth.org',
    ],
    society_name: 'Ethiopian Red Cross Society',
    name: 'Ethiopia',
    overview: null,
    translation_module_original_language: 'en',
};

export const appealKeySelector = (option: AppealListItem) => option.id;
export const appealTypeKeySelector = (option: AppealTypeOption) => option.key;
export const appealTypeLabelSelector = (option: AppealTypeOption) => option.value;
