import { use } from 'react';

import GoContext from '#contexts/GoContext';

function useGoContext() {
    return use(GoContext);
}
export default useGoContext;
