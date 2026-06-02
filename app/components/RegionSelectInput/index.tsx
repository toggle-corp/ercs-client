import { SelectInput } from '@ifrc-go/ui';

import {
    keySelector,
    labelSelector,
    type Selector,
} from '#utils/utils';

// Note: This will dynamically fetch from server
const ethiopiaRegions: Selector[] = [
    { key: 'AA', label: 'Addis Ababa' },
    { key: 'AF', label: 'Afar' },
    { key: 'AM', label: 'Amhara' },
    { key: 'BE', label: 'Benishangul-Gumuz' },
    { key: 'CERS', label: 'Central Ethiopia Regional State' },
    { key: 'DR', label: 'Dire Dawa' },
    { key: 'GA', label: 'Gambela' },
    { key: 'HA', label: 'Harari' },
    { key: 'OR', label: 'Oromia' },
    { key: 'SI', label: 'Sidama' },
    { key: 'SO', label: 'Somali' },
    { key: 'SW', label: 'South West Ethiopia' },
    { key: 'SNNP', label: 'SNNPR' },
    { key: 'TI', label: 'Tigray' },
];

type Props = {
  name: string;
  value: string | undefined;
  onChange: (value: string | undefined, name: string) => void;
};

function RegionSelectInput(props: Props) {
    const { name, value, onChange } = props;
    return (
        <SelectInput
            name={name}
            options={ethiopiaRegions}
            keySelector={keySelector}
            labelSelector={labelSelector}
            value={value}
            onChange={onChange}
            placeholder="Select region"
        />
    );
}

export default RegionSelectInput;
