import {
    createContext,
    useMemo,
} from 'react';

import {
    type GoApiResponse,
    useRequest,
} from '#utils/restRequest';

export type GlobalEnums = Partial<GoApiResponse<'/api/v2/global-enums/'>>;
export type CountryResponse = GoApiResponse<'/api/v2/country/{id}/'>
export type DisasterTypes = GoApiResponse<'/api/v2/disaster_type/'>;

const countryId = 65; // ethiopia

export interface GoContextInterface {
    countryId: number;

    countryResponse: CountryResponse | undefined;
    countryResponsePending: boolean;

    disasterTypes?: DisasterTypes;
    disasterTypesPending?: boolean;

    globalEnums?: GlobalEnums;
    globalEnumsPending?: boolean;
}

const GoContext = createContext<GoContextInterface>({
    countryId: 0,
    countryResponse: undefined,
    countryResponsePending: false,
    disasterTypes: undefined,
    disasterTypesPending: false,
    globalEnums: undefined,
    globalEnumsPending: false,
});

export function GoContextProvider({ children }: { children: React.ReactNode }) {
    const {
        pending: countryResponsePending,
        response: countryResponse,
    } = useRequest({
        url: '/api/v2/country/{id}/',
        preserveResponse: true,
        pathVariables: {
            id: Number(countryId),
        },
    });

    const {
        response: disasterTypes,
        pending: disasterTypesPending,
    } = useRequest({
        url: '/api/v2/disaster_type/',
        preserveResponse: true,
    });

    const {
        response: globalEnums,
        pending: globalEnumsPending,
    } = useRequest({
        url: '/api/v2/global-enums/',
        preserveResponse: true,
    });

    const contextValue = useMemo(() => ({
        countryId,
        countryResponse,
        countryResponsePending,
        disasterTypes,
        disasterTypesPending,
        globalEnums,
        globalEnumsPending,
    }), [
        countryResponse,
        countryResponsePending,
        disasterTypes,
        disasterTypesPending,
        globalEnums,
        globalEnumsPending,
    ]);

    return (
        <GoContext.Provider value={contextValue}>
            {children}
        </GoContext.Provider>
    );
}

export default GoContext;
