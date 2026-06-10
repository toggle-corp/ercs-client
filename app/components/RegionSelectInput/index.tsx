import {
    SelectInput,
    type SelectInputProps,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import {
    AdminAreaLevel,
    type AdminAreasQuery,
    useAdminAreasQuery,
} from '#generated/types/graphql';
import {
    idSelector,
    nameSelector,
} from '#utils/utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const REGION_QUERY = gql`
    query AdminAreas($filters: AdminAreaFilter) {
        adminAreas(filters: $filters) {
            results {
                centroidLat
                centroidLon
                id
                level
                levelDisplay
                name
                parentId
                pcode
            }
            totalCount
        }
    }
`;

export type RegionItem = NonNullable<AdminAreasQuery['adminAreas']['results']>[number];

type Props<NAME> = SelectInputProps<
    string,
    NAME,
    RegionItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    'value' | 'name' | 'options' | 'keySelector' | 'labelSelector'
> & {
    className?: string;
    name: NAME;
    value: string | undefined | null;
    onChange: (
        newValue: string | undefined,
        name: NAME,
        option: RegionItem | undefined,
    ) => void;
};

function RegionSelectInput<const NAME>(props: Props<NAME>) {
    const {
        className,
        name,
        value,
        onChange,
        disabled,
        ...otherProps
    } = props;

    const [{ data, fetching }] = useAdminAreasQuery({
        variables: {
            filters: {
                level: AdminAreaLevel.Region,
            },
        },
    });

    const regions = data?.adminAreas.results;

    return (
        <SelectInput
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...otherProps}
            className={className}
            name={name}
            options={regions}
            keySelector={idSelector}
            labelSelector={nameSelector}
            value={value}
            onChange={onChange}
            disabled={disabled || fetching}
            placeholder="Select region"
        />
    );
}

export default RegionSelectInput;
