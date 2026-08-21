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
import {
    type TeamsQuery,
    useTeamsQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TEAMS_QUERY = gql`
    query Teams(
        $pagination: OffsetPaginationInput,
        $filters: TeamFilter
    ) {
        teams(
            filters: $filters
            pagination: $pagination
        ) {
            totalCount
            results {
                id
                name
            }
        }
    }
`;
const teamKeySelector = (item: TeamList) => item.id;

type TeamList = NonNullable<TeamsQuery['teams']['results']>[number];

function TeamActions({ id }: {id: string}) {
    return (
        <Link
            to="team"
            attrs={{ id }}
            colorVariant="primary"
        >
            View Members
        </Link>
    );
}

function TeamList() {
    const {
        limit,
        page,
        rawFilter,
        filter,
        setFilterField,
        setPage,
        offset,
    } = useFilterState<{
        searchText?: string
    }>({
        filter: {},
        pageSize: 6,
    });
    const [{ data, fetching }] = useTeamsQuery(({
        variables: {
            filters: {
                search: filter.searchText,
            },
            pagination: {
                limit,
                offset,
            },
        },
    }));
    const teams = data?.teams.results ?? [];

    const columns = [
        createStringColumn<TeamList, string | number>(
            'sn',
            'S.N.',
            (item) => String(teams.indexOf(item) + 1),
            { columnWidth: 20 },
        ),
        createStringColumn<TeamList, string>(
            'name',
            'Team Name',
            (dept) => dept?.name,
        ),
        createElementColumn<TeamList, string, {id: string}>(
            'action',
            'Actions',
            TeamActions,
            (_key, item) => ({
                id: item.id,
            }),
        ),
    ];
    return (
        <Page
            title="Teams"
            heading="Teams"
            description="A dedicated team committed to delivering impactful solutions."
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
                        itemsCount={data?.teams?.totalCount ?? 0}
                        maxItemsPerPage={limit}
                        onActivePageChange={setPage}
                    />
                )}
                empty={teams.length === 0}
            >
                <Table
                    keySelector={teamKeySelector}
                    columns={columns}
                    data={teams}
                    filtered={false}
                    pending={fetching}
                />
            </Container>
        </Page>
    );
}

export default TeamList;
