import { useParams } from 'react-router';
import { SearchLineIcon } from '@ifrc-go/icons';
import {
    Container,
    ListView,
    Pager,
    Table,
    TextInput,
} from '@ifrc-go/ui';
import { SortContext } from '@ifrc-go/ui/contexts';
import {
    createElementColumn,
    createStringColumn,
} from '@ifrc-go/ui/utils';
import { gql } from 'urql';

import ExportButton from '#components/ExportButton';
import Link from '#components/Link';
import Page from '#components/Page';
import {
    type TeamMembersExportQuery,
    type TeamMembersQuery,
    useTeamMembersQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';
import useGraphQLToCSV from '#hooks/useGraphqlToCsv';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TEAM_MEMBERS_QUERY = gql`
    query TeamMembers(
        $offset: Int
        $limit: Int
        $search: String
        $woredas: [ID!]
        $teamId: ID!
        $regions: [ID!]
    ) {
        team(id: $teamId) {
            id
            name
            description
        }
        teamMembers(
            pagination: { limit: $limit, offset: $offset }
            filters: {
                search: $search
                woredas: $woredas
                teamId: $teamId
                regions: $regions
            }
        ) {
            totalCount
            results {
                woredaId
                updatedAt
                training
                teamId
                sex
                regionId
                position
                phoneNumber
                order
                name
                id
                fieldOfStudy
                email
                createdAt
            }
        }
    }
`;

const TEAM_MEMBERS_EXPORT_QUERY = gql`
    query TeamMembersExport(
        $search: String
        $woredas: [ID!]
        $teamId: ID!
        $regions: [ID!]
    ) {
        teamMembers(
            filters: {
                search: $search
                woredas: $woredas
                teamId: $teamId
                regions: $regions
            }
        ) {
            results {
                id
                name
                email
                sex
                phoneNumber
                position
                training
                fieldOfStudy
                createdAt
                updatedAt
            }
        }
    }
`;

function idSelector<T>(item: { id: T }) {
    return item.id;
}

type MemberList = NonNullable<TeamMembersQuery['teamMembers']['results']>[number];

function NameEmailCell({
    fullName,
    email,
}: {
    fullName?: string | null;
    email?: string | null;
}) {
    return (
        <ListView layout="block" spacing="2xs">
            <span style={{ fontWeight: 500 }}>{fullName}</span>
            <Link external href={`mailto:${email}`} withUnderline>
                {email}
            </Link>
        </ListView>
    );
}

function Members() {
    const { id } = useParams<{ id: string }>();
    const {
        sortState,
        limit,
        page,
        setPage,
        offset,
        filter,
        setFilterField,
        rawFilter,
    } = useFilterState<{
            searchText?: string,
            sex?:string
        }>({
            filter: {},
            pageSize: 15,
        });

    const [{ fetching, data }] = useTeamMembersQuery({
        variables: {
            teamId: id!,
            offset,
            limit,
            search: filter.searchText,
        },
        pause: !id,
    });

    const members = data?.teamMembers.results ?? [];

    const {
        pending: exportPending,
        trigger: triggerExport,
    } = useGraphQLToCSV<TeamMembersExportQuery>({
        query: TEAM_MEMBERS_EXPORT_QUERY,
        filename: `team-${data?.team.id ? data?.team.name.toLowerCase() : id}-members.csv`,
        transform: (responseData) => (
            responseData.teamMembers.results ?? []
        ).map((member) => ({
            ID: member.id,
            Name: member.name,
            Email: member.email,
            Gender: member.sex,
            'Phone Number': member.phoneNumber,
            Position: member.position,
            Training: member.training,
            'Field of Study': member.fieldOfStudy,
            'Created At': member.createdAt,
            'Updated At': member.updatedAt,
        })),
    });

    const handleExport = () => {
        if (!id) return;
        triggerExport({
            teamId: id,
            search: filter.searchText,
        });
    };

    const columns = [
        createStringColumn<MemberList, string | number>(
            'sn',
            'S.N.',
            (member) => String(members.indexOf(member) + 1),
            { columnWidth: 20 },
        ),
        createElementColumn<
            MemberList,
            string | number,
            { fullName?: string | null; email?: string | null }
        >(
            'name',
            'Full Name',
            NameEmailCell,
            (_, member) => ({
                fullName: member?.name,
                email: member?.email,
            }),
        ),
        createStringColumn<MemberList, string | number >(
            'sex',
            'Gender',
            (dept) => dept?.sex?.toString(),
        ),
        createStringColumn<MemberList, string | number>(
            'phoneNumber',
            'Number',
            (dept) => dept?.phoneNumber,
        ),
        createStringColumn<MemberList, string | number>(
            'position',
            'Position',
            (dept) => dept?.position,
        ),
        createStringColumn<MemberList, string | number>(
            'training',
            'Training',
            (dept) => dept?.training,
        ),
        createStringColumn<MemberList, string | number>(
            'fieldOfStudy',
            'Field of study',
            (dept) => dept?.fieldOfStudy,
        ),
    ];

    return (
        <Page
            heading={data?.team.name}
            description={(
                <i>
                    {members?.length}
                    {' '}
                    Members
                </i>
            )}
        >
            <ListView
                layout="block"
            >
                <ListView
                    withSpaceBetweenContents
                >
                    <TextInput
                        name="searchText"
                        placeholder="Search"
                        value={rawFilter.searchText}
                        onChange={setFilterField}
                        icons={<SearchLineIcon />}
                    />
                    <ExportButton
                        pendingExport={exportPending}
                        onClick={handleExport}
                        totalCount={members.length}
                    />
                </ListView>
                <Container
                    pending={fetching}
                    footerActions={(
                        <Pager
                            activePage={page}
                            itemsCount={data?.teamMembers.totalCount ?? 0}
                            maxItemsPerPage={limit}
                            onActivePageChange={setPage}
                        />
                    )}
                >

                    <SortContext.Provider value={sortState}>
                        <Table
                            keySelector={idSelector}
                            columns={columns}
                            data={members}
                            filtered={false}
                            pending={fetching}
                        />
                    </SortContext.Provider>
                </Container>
            </ListView>
        </Page>
    );
}

export default Members;
