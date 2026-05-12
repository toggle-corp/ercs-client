const {
    APP_TITLE,
    APP_ENVIRONMENT,
    APP_GRAPHQL_ENDPOINT,
    APP_GO_URL,
    APP_GO_API,
    APP_MAPBOX_TOKEN,
    APP_GRAPHQL_CODEGEN_ENDPOINT,
    APP_GO_RISK_API_ENDPOINT,
} = import.meta.env;

export const environment = APP_ENVIRONMENT;
export const appTitle = APP_TITLE;
export const api = APP_GRAPHQL_ENDPOINT;
export const goApi = APP_GO_API;
export const riskApi = APP_GO_RISK_API_ENDPOINT;
export const mapboxToken = APP_MAPBOX_TOKEN;
export const codegen = APP_GRAPHQL_CODEGEN_ENDPOINT;
export const goUrl = APP_GO_URL;
