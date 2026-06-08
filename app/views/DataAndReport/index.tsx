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
    useReportsQuery,
    useThematicAreasQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

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
        $thematicAreaId: ID
        $limit: Int = 10
        $offset: Int = 0
        $reportType: ReportTypeEnum
    ) {
        reports(
            filters: { thematicAreaId: $thematicAreaId, reportType: $reportType }
            pagination: { limit: $limit, offset: $offset }
        ) {
            totalCount
            results {
                id
                title
                description
                contentType
                visibility
                publishedAt
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

    const {
        limit,
        page,
        rawFilter,
        setFilterField,
        setPage,
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
            thematicAreaId: rawFilter.thematicAreaId,
            // TODO: add search filter in backend and uncomment below line
            // search: rawFilter.search,

            // NOTE: Report Type variable value based on Report Type enum where 10 is Report
            reportType: ReportTypeEnum.Report,
            limit,
            offset,
        },
    });
    const thematicAreaOptions = data?.thematicAreas?.results ?? [];
    const reportDetails = reportsData?.reports?.results ?? [];

    return (
        <Page
            actions={(
                // TODO: add region filter
                <RegionSelectInput
                    name="region"
                    value={undefined}
                    onChange={() => {}}
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
                    pending={fetching}
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
                    {reportDetails.map((report) => (
                        <Link
                            to="reportDetail"
                            withFullWidth
                            attrs={{ id: report.id }}
                        >
                            <ReportCard
                                key={report.id}
                                report={report}
                            />
                        </Link>
                    ))}
                </Container>
            </ListView>
        </Page>
    );
}

export default DataAndReport;
