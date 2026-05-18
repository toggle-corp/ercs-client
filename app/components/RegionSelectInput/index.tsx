import { SelectInput } from '@ifrc-go/ui';

type RegionOption = {
  key: string;
  label: string;
};

// Note: This will dynamically fetch from server
const ethiopiaRegions: RegionOption[] = [
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

function RegionSelectInput({ name, value, onChange }: Props) {
    return (
        <SelectInput
            name={name}
            options={ethiopiaRegions}
            keySelector={(o) => o.key}
            labelSelector={(o) => o.label}
            value={value}
            onChange={onChange}
            placeholder="Select region"
        />
    );
}

export default RegionSelectInput;
