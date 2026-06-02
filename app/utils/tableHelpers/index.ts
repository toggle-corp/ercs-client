import {
    type Column,
    HeaderCell,
    type HeaderCellProps,
    type NumberOutputProps,
    type SortDirection,
} from '@ifrc-go/ui';
import {
    createNumberColumn,
    createStringColumn,
} from '@ifrc-go/ui/utils';
import { _cs } from '@togglecorp/fujs';

import Link, { type Props as LinkProps } from '#components/Link';

import styles from './styles.module.css';

type Options<D, K, CompProps, HeaderProps> = {
    sortable?: boolean,
    defaultSortDirection?: SortDirection,

    columnClassName?: string;
    headerCellRendererClassName?: string;
    headerContainerClassName?: string;
    cellRendererClassName?: string;
    cellContainerClassName?: string;
    columnWidth?: Column<D, K, CompProps, HeaderProps>['columnWidth'];
    columnStretch?: Column<D, K, CompProps, HeaderProps>['columnStretch'];
    columnStyle?: Column<D, K, CompProps, HeaderProps>['columnStyle'];

    headerInfoTitle?: HeaderCellProps['infoTitle'];
    headerInfoDescription?: HeaderCellProps['infoDescription'];
}

export function createLinkColumn<D, K>(
    id: string,
    title: string,
    accessor: (item: D) => React.ReactNode,
    rendererParams: (item: D) => LinkProps,
    options?: Options<D, K, LinkProps, HeaderCellProps>,
) {
    const item: Column<D, K, LinkProps, HeaderCellProps> & {
        valueSelector: (item: D) => string | undefined | null,
        valueComparator: (foo: D, bar: D) => number,
    } = {
        id,
        title,
        headerCellRenderer: HeaderCell,
        headerCellRendererParams: {
            sortable: options?.sortable,
            infoTitle: options?.headerInfoTitle,
            infoDescription: options?.headerInfoDescription,
        },
        cellRenderer: Link,
        cellRendererParams: (_: K, datum: D): LinkProps => ({
            children: accessor(datum) || '--',
            withUnderline: true,
            ...rendererParams(datum),
        }),
        valueSelector: () => '',
        valueComparator: () => 0,
        cellRendererClassName: options?.cellRendererClassName,
        columnClassName: options?.columnClassName,
        headerCellRendererClassName: options?.headerCellRendererClassName,
        cellContainerClassName: options?.cellContainerClassName,
        columnWidth: options?.columnWidth,
        columnStretch: options?.columnStretch,
        columnStyle: options?.columnStyle,
    };

    return item;
}

export function createCountryColumn<D, K>(
    id: string,
    title: string,
    accessor: (item: D) => React.ReactNode,
    rendererParams: (item: D) => LinkProps,
    options?: Options<D, K, LinkProps, HeaderCellProps>,
) {
    return createLinkColumn<D, K>(
        id,
        title,
        accessor,
        rendererParams,
        {
            ...options,
            columnClassName: _cs(styles.country, options?.columnClassName),
        },
    );
}

export function createEventColumn<D, K>(
    id: string,
    title: string,
    accessor: (item: D) => React.ReactNode,
    rendererParams: (item: D) => LinkProps,
    options?: Options<D, K, LinkProps, HeaderCellProps>,
) {
    return createLinkColumn<D, K>(
        id,
        title,
        accessor,
        rendererParams,
        {
            ...options,
            columnClassName: _cs(styles.event, options?.columnClassName),
        },
    );
}

export function createDisasterTypeColumn<D, K extends string | number>(
    id: string,
    title: string,
    accessor: (item: D) => string | undefined | null,
    options?: Options<D, K, { value: string }, HeaderCellProps>,
) {
    return createStringColumn<D, K>(
        id,
        title,
        accessor,
        {
            ...options,
            columnClassName: _cs(styles.disasterType, options?.columnClassName),
        },
    );
}

export function createTitleColumn<D, K extends string | number>(
    id: string,
    title: string,
    accessor: (item: D) => string | undefined | null,
    options?: Options<D, K, { value: string }, HeaderCellProps>,
) {
    return createStringColumn<D, K>(
        id,
        title,
        accessor,
        {
            ...options,
            columnClassName: _cs(styles.title, options?.columnClassName),
        },
    );
}

export function createAppealCodeColumn<D, K extends string | number>(
    id: string,
    title: string,
    accessor: (item: D) => string | undefined | null,
    options?: Options<D, K, { value: string }, HeaderCellProps>,
) {
    return createStringColumn<D, K>(
        id,
        title,
        accessor,
        {
            ...options,
            columnClassName: _cs(styles.appealCode, options?.columnClassName),
        },
    );
}

export function createBudgetColumn<D, K extends string | number>(
    id: string,
    title: string,
    accessor: (item: D) => number | undefined | null,
    options?: Options<D, K, NumberOutputProps, HeaderCellProps>,
) {
    return createNumberColumn<D, K>(
        id,
        title,
        accessor,
        {
            suffix: ' CHF',
            ...options,
            columnClassName: _cs(styles.budget, options?.columnClassName),
        },
    );
}
