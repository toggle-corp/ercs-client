import { createContext } from 'react';

import type { GoApiResponse } from '#utils/restRequest';

export type GlobalEnums = Partial<GoApiResponse<'/api/v2/global-enums/'>>;
export type CountryResponse = GoApiResponse<'/api/v2/country/{id}/'>
export type DisasterTypes = GoApiResponse<'/api/v2/disaster_type/'>;

export interface GoContextInterface {
    countryId: number ;

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

export default GoContext;
