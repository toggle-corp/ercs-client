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
import {
    decodeDate,
    formatDateToString,
} from '@togglecorp/fujs';
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
        $pagination: OffsetPaginationInput,
        $filters: TeamMemberFilter
        $teamId: ID!
    ) {
        team(id: $teamId) {
            id
            name
            description
        }
        teamMembers(
            filters: $filters
            pagination: $pagination
        ) {
            totalCount
            results {
                woreda
                updatedAt
                training
                teamId
                sex
                region
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
        $filters: TeamMemberFilter
        $pagination: OffsetPaginationInput
    ) {
        teamMembers(
            filters: $filters
            pagination: $pagination
        ) {
            totalCount
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
            teamId: id ?? '',
            filters: {
                search: filter.searchText,
                teamId: id,
            },
            pagination: {
                offset,
                limit,
            },
        },
        pause: !id,
    });

    const members = data?.teamMembers.results ?? [];

    const {
        pending: exportPending,
        progress: exportProgress,
        trigger: triggerExport,
    } = useGraphQLToCSV<TeamMembersExportQuery>({
        query: TEAM_MEMBERS_EXPORT_QUERY,
        filename: `team-${data?.team.id ? data?.team.name.toLowerCase() : id}-members.csv`,
        fieldName: 'teamMembers',
        transform: (responseData) => (
            responseData.teamMembers.results ?? []
        ).map((member) => {
            const createdAt = member.createdAt ? formatDateToString(decodeDate(member.createdAt as string), 'yyyy-dd-MM') : '';
            const updatedAt = member.updatedAt ? formatDateToString(decodeDate(member.updatedAt as string), 'yyyy-dd-MM') : '';
            return {
                ID: member.id,
                Name: member.name,
                Email: member.email,
                Gender: member.sex,
                'Phone Number': member.phoneNumber,
                Position: member.position,
                Training: member.training,
                'Field of Study': member.fieldOfStudy,
                'Created At': createdAt,
                'Updated At': updatedAt,
            };
        }),
    });

    const handleExport = () => {
        if (!id) return;
        triggerExport({
            filters: {
                teamId: id,
            },
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
            title="Team"
            heading={data?.team.name}
            description={(
                <i>
                    {data?.teamMembers.totalCount}
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
                    withWrap
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
                        progress={exportProgress}
                        onClick={handleExport}
                        totalCount={data?.teamMembers.totalCount}
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
