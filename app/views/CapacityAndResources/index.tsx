import { SearchLineIcon } from '@ifrc-go/icons';
import {
    Container,
    Pager,
    Table,
    TextInput,
} from '@ifrc-go/ui';
import {
    createElementColumn,
    createStringColumn,
} from '@ifrc-go/ui/utils';
import { gql } from 'urql';

import Link from '#components/Link';
import Page from '#components/Page';
import RegionSelectInput from '#components/RegionSelectInput';
import {
    type CapacityAndResourcesQuery,
    useCapacityAndResourcesQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CAPACITY_AND_RESOURCES_QUERY = gql`
    query CapacityAndResources(
        $limit: Int = 10
        $offset: Int = 0
        $search: String = ""
        $regionId: ID
        $isActive: Boolean 
    ) {
        capacityAndResources(
            pagination: { limit: $limit, offset: $offset }
            filters: { search: $search, regionId: $regionId, isActive: $isActive }
        ) {
            totalCount
            results {
                title
                id
            }
        }
    }
`;
const capacityKeySelector = (item: CapacityAndResourcesList) => item.id;

type CapacityAndResourcesList = NonNullable<CapacityAndResourcesQuery['capacityAndResources']['results']>[number];

function ResourcesActions({ id }: {id: string}) {
    return (
        <Link
            to="capacityAndResourcesDetails"
            attrs={{ id }}
            colorVariant="primary"
        >
            View Details
        </Link>
    );
}

function CapacityAndResourcesList() {
    const {
        limit,
        page,
        rawFilter,
        filter,
        setFilterField,
        setPage,
        offset,
    } = useFilterState<{
        regionId?: string,
        searchText?: string
    }>({
        filter: {},
        pageSize: 6,
    });
    const [{ data, fetching }] = useCapacityAndResourcesQuery({
        variables: {
            // regionId: '',
            isActive: true,
            search: filter.searchText,
            limit,
            offset,
        },
    });
    const capacityAndResourcesData = data?.capacityAndResources.results ?? [];
    const columns = [
        createStringColumn<CapacityAndResourcesList, string | number>(
            'sn',
            'S.N.',
            (item) => String(capacityAndResourcesData.indexOf(item) + 1),
            { columnWidth: 20 },
        ),
        createStringColumn<CapacityAndResourcesList, string>(
            'title',
            'Capacity and Resources',
            (dept) => dept?.title,
        ),
        createElementColumn<CapacityAndResourcesList, string, {id: string}>(
            'action',
            'Actions',
            ResourcesActions,
            (_key, item) => ({
                id: item.id,
            }),
        ),
    ];
    return (
        <Page
            actions={(
                <RegionSelectInput
                    name="region"
                    value={undefined}
                    onChange={() => {}}
                />
            )}
            heading="Capacity and Resources"
            description="Monitor and allocate capacity and resources effectively to support humanitarian operations and response efforts."
        >
            <Container
                pending={fetching}
                headerActions={(
                    <TextInput
                        name="searchText"
                        placeholder="Search"
                        value={rawFilter.searchText}
                        onChange={setFilterField}
                        icons={<SearchLineIcon />}
                    />
                )}
                footerActions={(
                    <Pager
                        activePage={page}
                        itemsCount={data?.capacityAndResources?.totalCount ?? 0}
                        maxItemsPerPage={limit}
                        onActivePageChange={setPage}
                    />
                )}
                empty={capacityAndResourcesData.length === 0}
            >
                <Table
                    keySelector={capacityKeySelector}
                    columns={columns}
                    data={capacityAndResourcesData}
                    filtered={false}
                    pending={fetching}
                />
            </Container>
        </Page>
    );
}

export default CapacityAndResourcesList;
