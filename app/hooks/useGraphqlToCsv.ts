import {
    useCallback,
    useState,
} from 'react';
import { type DocumentNode } from 'graphql';
import Papa from 'papaparse';
import { useClient } from 'urql';

// Extracts the first array it finds in the response object
function flattenData(data: object): object[] {
    return Object.values(data).reduce<object[]>((acc, value) => {
        if (acc.length > 0) return acc;
        if (Array.isArray(value)) return value;
        if (typeof value === 'object' && value !== null) return flattenData(value);
        return acc;
    }, []);
}

function downloadCsv(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function useGraphQLToCSV<D
 extends object, V extends Record<string, unknown> = Record<string, unknown>>({
    query,
    filename = 'export.csv',
    // optional: pick/rename fields before CSV conversion
    transform,
}: {
    query: DocumentNode;
    filename?: string;
    transform?: (data: D) => object[];
}) {
    const client = useClient();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const trigger = useCallback(async (variables?: V) => {
        setPending(true);
        setError(null);

        const result = await client.query<D>(query, variables ?? {}).toPromise();

        setPending(false);

        if (result.error || result.data == null) {
            setError(result.error ?? 'No data returned');
            return;
        }

        const rows = transform
            ? transform(result.data)
            : flattenData(result.data);

        const csv = Papa.unparse(rows);
        downloadCsv(csv, filename);
    }, [client, query, filename, transform]);

    return { pending, error, trigger } as const;
}

export default useGraphQLToCSV;
