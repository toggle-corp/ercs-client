import { createContext } from 'react';

import type { GoApiResponse } from '#utils/restRequest';

type CountryResponse = GoApiResponse<'/api/v2/country/{id}/'>
export interface CountryContextInterface {
    countryId: number ;
    countryResponse: CountryResponse | undefined;
    countryResponsePending: boolean;
}

const CountryContext = createContext<CountryContextInterface>({
    countryId: 0,
    countryResponse: undefined,
    countryResponsePending: false,
});
export default CountryContext;
