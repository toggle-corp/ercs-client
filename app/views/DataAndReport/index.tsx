import { useState } from 'react';
import { SearchLineIcon } from '@ifrc-go/icons';
import {
    Container,
    Description,
    ListView,
    Pager,
    SelectInput,
    TextInput,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import Link from '#components/Link';
import Page from '#components/Page';
import RegionSelectInput from '#components/RegionSelectInput';
import ReportCard from '#components/ReportCard';
import {
    ReportTypeEnum,
    ReportVisibility,
    useReportsQuery,
    useThematicAreasQuery,
} from '#generated/types/graphql';
import useAuth from '#hooks/useAuth';
import useFilterState from '#hooks/useFilterState';

import styles from './styles.module.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ThematicAreas_QUERY = gql`
    query ThematicAreas {
        thematicAreas {
            totalCount
            results {
                name
                id
            }
        }
    }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Reports_QUERY = gql`
    query Reports(
        $pagination: OffsetPaginationInput,
        $filters: ReportFilter
    ) {
        reports(
            filters: $filters
            pagination: $pagination
        ) {
            totalCount
            results {
                id
                title
                description
                contentType
                visibility
                publishedAt
                contentType
                createdAt
                owner
                iframeUrl
                thematicAreaId
                regionId
                disasterType
                file {
                    name
                    size
                    url
                }
                coverImage {
                    name
                    size
                    url
                }                    
            }
        }
    }
`;

type ThematicArea = {
    id: string;
    name: string;
};

const keySelector = (item: ThematicArea) => item.id;
const labelSelector = (item: ThematicArea) => item.name;

function DataAndReport() {
    const [{ data }] = useThematicAreasQuery();
    const [regionId, setRegionId] = useState<string | undefined>(undefined);
    const { isAuthenticated, isAuthLoading } = useAuth();

    const {
        limit,
        page,
        rawFilter,
        setFilterField,
        setPage,
        filter,
        offset,
    } = useFilterState<{
        thematicAreaId?: string,
        searchText?: string
    }>({
        filter: {},
        pageSize: 6,
    });

    const [{ data: reportsData, fetching }] = useReportsQuery({
        variables: {
            filters: {
                thematicAreaId: rawFilter.thematicAreaId,
                reportType: ReportTypeEnum.Report,
                search: filter.searchText ?? '',
                regions: regionId ? [regionId] : null,
                visibility: isAuthenticated ? undefined : ReportVisibility.Public,
            },
            pagination: {
                limit,
                offset,
            },
        },
        pause: isAuthLoading,
    });
    const thematicAreaOptions = data?.thematicAreas?.results ?? [];
    const reportDetails = reportsData?.reports?.results ?? [];

    return (
        <Page
            title="Dataset Overview"
            actions={(
                <RegionSelectInput
                    name="region"
                    value={regionId}
                    onChange={setRegionId}
                />
            )}
            heading="Dataset Overview"
            description="Explore historical data, research findings and operational reports to support informed decision-making and planning."
        >
            <ListView
                layout="block"
            >
                <ListView
                    withSpaceBetweenContents
                >
                    <SelectInput
                        placeholder="Thematic Areas"
                        name="thematicAreaId"
                        value={rawFilter.thematicAreaId}
                        onChange={setFilterField}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        options={thematicAreaOptions}
                    />
                    <TextInput
                        name="searchText"
                        placeholder="Search"
                        value={rawFilter.searchText}
                        onChange={setFilterField}
                        icons={<SearchLineIcon />}
                    />
                </ListView>
                <Description
                    withLightText
                >
                    Showing all
                    {' '}
                    <strong>{reportsData?.reports.totalCount}</strong>
                    {' '}
                    Data & Reports
                </Description>
                <Container
                    withLargeBreakpointInHeader
                    pending={fetching || isAuthLoading}
                    footerActions={(
                        <Pager
                            activePage={page}
                            itemsCount={reportsData?.reports?.totalCount ?? 0}
                            maxItemsPerPage={limit}
                            onActivePageChange={setPage}
                        />
                    )}
                    empty={reportDetails.length === 0}
                >
                    <ListView
                        layout="block"
                        className={styles.reportList}
                    >
                        {reportDetails.map((report) => (
                            <div
                                key={report.id}
                                className={styles.reportListItem}
                            >
                                <Link
                                    to="reportDetail"
                                    withFullWidth
                                    attrs={{ id: report.id }}
                                >
                                    <ReportCard
                                        report={report}
                                    />
                                </Link>
                            </div>
                        ))}
                    </ListView>
                </Container>
            </ListView>
        </Page>
    );
}

export default DataAndReport;
