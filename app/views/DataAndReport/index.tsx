import {
    DashboardLineIcon,
    SearchLineIcon,
} from '@ifrc-go/icons';
import {
    Container,
    Description,
    Heading,
    Image,
    InlineLayout,
    ListView,
    Pager,
    SelectInput,
    TextInput,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import Link from '#components/Link';
import Page from '#components/Page';
import {
    useReportsQuery,
    useThematicAreasQuery,
} from '#generated/types/graphql';
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
        $thematicAreaId: ID
        $limit: Int = 10
        $offset: Int = 0
    ) {
        reports(
            filters: { thematicAreaId: $thematicAreaId }
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
            // search: rawFilter.search,
            limit,
            offset,
        },
    });
    const thematicAreaOptions = data?.thematicAreas?.results ?? [];
    const reportDetails = reportsData?.reports?.results ?? [];

    return (
        <Page
            heading="Dataset Overview"
            description="Explore historical data, research findings and operational reports to support informed decision-making and planning."
        >
            <Container
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
                <ListView layout="block">
                    <ListView withSpaceBetweenContents>
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
                    {reportDetails.map((report) => (
                        <Link
                            to="reportDetail"
                            withFullWidth
                            attrs={{ id: report.id }}
                        >
                            <InlineLayout
                                key={report.id}
                                before={report.coverImage?.url ? (
                                    <Image
                                        src={report.coverImage?.url}
                                        alt="Report"
                                        size="sm"
                                        withContainedFit
                                        className={styles.coverImage}
                                    />
                                ) : (
                                    <ListView
                                        withCenteredContents
                                        className={styles.defaultCoverImage}
                                    >
                                        <DashboardLineIcon
                                            className={styles.dashboardIcon}
                                        />
                                    </ListView>
                                )}
                                contentAlignment="start"
                                spacing="lg"
                            >
                                <ListView layout="block">
                                    <Heading
                                        level={4}
                                    >
                                        {report.title}
                                    </Heading>
                                    <Description
                                        withLightText
                                    >
                                        {report.description}
                                    </Description>
                                </ListView>
                            </InlineLayout>
                        </Link>
                    ))}
                </ListView>
            </Container>
        </Page>
    );
}

export default DataAndReport;
