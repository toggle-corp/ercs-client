import { SearchLineIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    Description,
    ListView,
    Pager,
    SelectInput,
    TextInput,
} from '@ifrc-go/ui';
import { isTruthyString } from '@togglecorp/fujs';
import { gql } from 'urql';

import Link from '#components/Link';
import Page from '#components/Page';
import RegionSelectInput from '#components/RegionSelectInput';
import {
    PmerReportCategory,
    PmerReportDocumentType,
    ReportVisibility,
    usePmerEnumsQuery,
    usePmerReportsQuery,
} from '#generated/types/graphql';
import useAuth from '#hooks/useAuth';
import useFilterState from '#hooks/useFilterState';

import PmerCard, { type PmerReport } from '../../components/PmerCard';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PMER_ENUMS_QUERY = gql`
    query PmerEnums {
        enums {
            PmerReportCategory {
                key
                label
            }
            PmerReportDocumentType {
                key
                label
            }
        }
    }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PMER_REPORTS_QUERY = gql`
    query PmerReports(
        $pagination: OffsetPaginationInput,
        $filters: PmerReportFilter
    ) {
        pmerReports(
            filters: $filters
            pagination: $pagination
        ) {
            totalCount
            results {
                id
                title
                description
                category
                categoryDisplay
                reportType
                reportTypeDisplay
                department
                project
                visibility
                createdAt
                region {
                    id
                    name
                }
                file {
                    name
                    size
                    url
                }
            }
        }
    }
`;

type CategoryOption = { key: PmerReportCategory, label: string };
type DocumentTypeOption = { key: PmerReportDocumentType, label: string };

const categoryKeySelector = (option: CategoryOption) => option.key;
const documentTypeKeySelector = (option: DocumentTypeOption) => option.key;
const enumLabelSelector = (option: { label: string }) => option.label;

function Pmer() {
    const { isAuthenticated, isAuthLoading } = useAuth();

    const [{ data: enumsData }] = usePmerEnumsQuery();

    const {
        limit,
        page,
        rawFilter,
        setFilterField,
        setPage,
        filter,
        filtered,
        rawFiltered,
        resetFilter,
        offset,
    } = useFilterState<{
        category?: PmerReportCategory,
        reportType?: PmerReportDocumentType,
        regionId?: string,
        searchText?: string,
    }>({
        filter: {},
        pageSize: 6,
    });

    const [{ data: pmerData, fetching }] = usePmerReportsQuery({
        variables: {
            filters: {
                category: rawFilter.category,
                reportType: rawFilter.reportType,
                title: isTruthyString(filter.searchText)
                    ? { iContains: filter.searchText }
                    : undefined,
                regionId: rawFilter.regionId,
                visibility: isAuthenticated ? undefined : ReportVisibility.Public,
            },
            pagination: {
                limit,
                offset,
            },
        },
        pause: isAuthLoading,
    });

    const categoryOptions: CategoryOption[] = enumsData?.enums.PmerReportCategory ?? [];
    const reportTypeOptions: DocumentTypeOption[] = enumsData
        ?.enums.PmerReportDocumentType ?? [];
    const pmerReports: PmerReport[] = pmerData?.pmerReports?.results ?? [];
    const totalCount = pmerData?.pmerReports?.totalCount ?? 0;

    return (
        <Page
            title="PMER Reports"
            heading="PMER Reports"
            description="Planning, monitoring, evaluation and reporting across ERCS programmes."
        >
            <Container
                withLargeBreakpointInHeader
                pending={fetching || isAuthLoading}
                filters={(
                    <>
                        <TextInput
                            name="searchText"
                            placeholder="Search by title"
                            value={rawFilter.searchText}
                            onChange={setFilterField}
                            icons={<SearchLineIcon />}
                        />
                        <RegionSelectInput
                            name="regionId"
                            placeholder="Region"
                            value={rawFilter.regionId}
                            onChange={setFilterField}
                        />
                        <SelectInput
                            placeholder="Report Category"
                            name="category"
                            value={rawFilter.category}
                            onChange={setFilterField}
                            keySelector={categoryKeySelector}
                            labelSelector={enumLabelSelector}
                            options={categoryOptions}
                        />
                        <SelectInput
                            placeholder="Report Type"
                            name="reportType"
                            value={rawFilter.reportType}
                            onChange={setFilterField}
                            keySelector={documentTypeKeySelector}
                            labelSelector={enumLabelSelector}
                            options={reportTypeOptions}
                        />
                        <Button
                            name={undefined}
                            onClick={resetFilter}
                            disabled={!rawFiltered}
                            styleVariant="outline"
                            colorVariant="primary"
                        >
                            Clear filters
                        </Button>
                    </>
                )}
                footerActions={(
                    <Pager
                        activePage={page}
                        itemsCount={totalCount}
                        maxItemsPerPage={limit}
                        onActivePageChange={setPage}
                    />
                )}
                empty={pmerReports.length === 0}
                filtered={filtered}
                emptyMessage="No PMER reports yet"
                filteredEmptyMessage="No PMER reports match these filters"
            >
                <ListView
                    layout="block"
                    spacing="sm"
                >
                    <Description
                        withLightText
                    >
                        Showing all
                        {' '}
                        <strong>{totalCount}</strong>
                        {' '}
                        PMER Reports
                    </Description>
                    <ListView
                        layout="block"
                        spacing="sm"
                        className={styles.reportList}
                    >
                        {pmerReports.map((report) => (
                            <div
                                key={report.id}
                                className={styles.reportListItem}
                            >
                                <Link
                                    to="pmerDetail"
                                    withFullWidth
                                    attrs={{ id: report.id }}
                                >
                                    <PmerCard
                                        report={report}
                                    />
                                </Link>
                            </div>
                        ))}
                    </ListView>
                </ListView>
            </Container>
        </Page>
    );
}

export default Pmer;
