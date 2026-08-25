import {
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import { type DocumentNode } from 'graphql';
import Papa from 'papaparse';
import { useClient } from 'urql';

function downloadCsv(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

const DEFAULT_PAGE_SIZE = 200;
const MAX_PAGES = 500;

interface PaginationParameters {
    limit: number;
    offset: number;
    page: number;
}

interface Props<D extends object, V extends Record<string, unknown>> {
    query: DocumentNode;
    filename?: string;
    transform: (data: D) => object[];
    fieldName: keyof D & string;
    pageSize?: number;
    getPaginationVariables?: (pagination: PaginationParameters) => Partial<V>;
}

function useGraphQLToCSV<
    D extends object,
    V extends Record<string, unknown> = Record<string, unknown>,
>(props: Props<D, V>) {
    const client = useClient();

    const propsRef = useRef(props);
    propsRef.current = props;

    const pendingRef = useRef(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<unknown>(undefined);
    const [progressCount, setProgressCount] = useState(0);
    const [total, setTotal] = useState<number | undefined>(undefined);

    const trigger = useCallback(async (variables?: V) => {
        if (pendingRef.current) {
            return;
        }
        pendingRef.current = true;

        const {
            query,
            filename = 'export.csv',
            transform,
            fieldName,
            pageSize = DEFAULT_PAGE_SIZE,
            getPaginationVariables = ({ limit, offset }: PaginationParameters) => ({
                pagination: { limit, offset },
            } as unknown as Partial<V>),
        } = propsRef.current;

        setPending(true);
        setError(undefined);
        setProgressCount(0);
        setTotal(undefined);

        const rows: object[] = [];
        const limit = pageSize;
        let page = 1;
        let totalCount: number | undefined;
        let pageCount: number | undefined;
        let fetchMore = true;

        try {
            while (fetchMore) {
                const offset = limit * (page - 1);
                // eslint-disable-next-line no-await-in-loop
                const result = await client.query<D>(
                    query,
                    {
                        ...variables,
                        ...getPaginationVariables({ limit, offset, page }),
                    } as V,
                    { requestPolicy: 'network-only' },
                ).toPromise();

                if (isDefined(result.error)) {
                    throw result.error;
                }
                if (isNotDefined(result.data)) {
                    throw new Error('No data returned');
                }

                const pageRows = transform(result.data);
                rows.push(...pageRows);

                if (page === 1) {
                    const { totalCount: count } = result.data[fieldName] as {
                        totalCount?: number | null;
                    };
                    totalCount = count ?? undefined;
                    setTotal(totalCount);
                    pageCount = isDefined(totalCount) ? Math.ceil(totalCount / limit) : undefined;
                }

                setProgressCount(
                    isDefined(totalCount)
                        ? Math.min(offset + pageRows.length, totalCount)
                        : offset + pageRows.length,
                );

                if (isDefined(pageCount)) {
                    fetchMore = page < pageCount;
                } else {
                    fetchMore = pageRows.length === limit;
                }

                page += 1;
                if (page > MAX_PAGES) {
                    fetchMore = false;
                }
            }
        } catch (err) {
            setError(err);
            return;
        } finally {
            setPending(false);
            pendingRef.current = false;
        }

        if (rows.length === 0) {
            return;
        }

        downloadCsv(Papa.unparse(rows), filename);
    }, [client]);

    const progress = useMemo(
        () => {
            if (isNotDefined(total) || total <= 0) {
                return undefined;
            }
            return Math.min(1, progressCount / total);
        },
        [progressCount, total],
    );

    return {
        pending,
        error,
        progress,
        progressCount,
        total,
        trigger,
    } as const;
}

export default useGraphQLToCSV;
