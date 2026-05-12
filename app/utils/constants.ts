import { listToMap } from '@togglecorp/fujs';

export const NUM_X_AXIS_TICKS_MIN = 3;
export const NUM_X_AXIS_TICKS_MAX = 12;

export const DEFAULT_X_AXIS_HEIGHT = 26;
export const DEFAULT_Y_AXIS_WIDTH = 46;
export const DEFAULT_Y_AXIS_WIDTH_WITH_LABEL = 66;

export const defaultChartMargin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

export const defaultChartPadding = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
};

// Map
export const DURATION_MAP_ZOOM = 1000;
export const DEFAULT_MAP_PADDING = 50;

// Storage

export const KEY_USER_STORAGE = 'user';
export const KEY_LANGUAGE_STORAGE = 'language';

// Search page

export const KEY_URL_SEARCH = 'keyword';
export const SEARCH_TEXT_LENGTH_MIN = 3;

// Risk

export const COLOR_HAZARD_CYCLONE = '#a4bede';
export const COLOR_HAZARD_DROUGHT = '#b68fba';
export const COLOR_HAZARD_FOOD_INSECURITY = '#b7c992';
export const COLOR_HAZARD_FLOOD = '#5a80b0';
export const COLOR_HAZARD_EARTHQUAKE = '#eca48c';
export const COLOR_HAZARD_STORM = '#97b8c2';
export const COLOR_HAZARD_WILDFIRE = '#ff5014';

// FIXME: should these constants satisfy an existing enum?
export const CATEGORY_RISK_VERY_LOW = 1;
export const CATEGORY_RISK_LOW = 2;
export const CATEGORY_RISK_MEDIUM = 3;
export const CATEGORY_RISK_HIGH = 4;
export const CATEGORY_RISK_VERY_HIGH = 5;

// Colors

export const COLOR_WHITE = '#ffffff';
// export const COLOR_TEXT = '#313131';
// export const COLOR_TEXT_ON_DARK = '#ffffff';
export const COLOR_LIGHT_GREY = '#e0e0e0';
export const COLOR_DARK_GREY = '#a5a5a5';
export const COLOR_BLACK = '#000000';
// const COLOR_LIGHT_YELLOW = '#ffd470';
export const COLOR_YELLOW = '#ff9e00';
export const COLOR_BLUE = '#4c5d9b';
export const COLOR_LIGHT_BLUE = '#c7d3e0';
export const COLOR_ORANGE = '#ff8000';
export const COLOR_RED = '#f5333f';
export const COLOR_GREEN = '#8BB656';
// const COLOR_DARK_RED = '#730413';
export const COLOR_PRIMARY_BLUE = '#011e41';
export const COLOR_PRIMARY_RED = '#f5333f';

export const COLOR_ACTIVE_REGION = '#7d8b9d';

// Import template

export const FONT_FAMILY_HEADER = 'Montserrat';

export const monthKeyList = Array.from(Array(12).keys());
export const multiMonthSelectDefaultValue = listToMap(
    monthKeyList,
    (key) => key,
    () => false,
);
