import { useParams } from 'react-router';
import {
    DownloadTwoFillIcon,
    SearchLineIcon,
} from '@ifrc-go/icons';
import {
    Button,
    Container,
    ListView,
    Pager,
    SelectInput,
    Table,
    TextInput,
} from '@ifrc-go/ui';
import { SortContext } from '@ifrc-go/ui/contexts';
import {
    createElementColumn,
    createStringColumn,
} from '@ifrc-go/ui/utils';
import { gql } from 'urql';

import Link from '#components/Link';
import Page from '#components/Page';
import {
    type TeamMembersQuery,
    useTeamMembersQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TEAM_MEMBERS_QUERY = gql`
    query TeamMembers(
        $offset: Int
        $limit: Int
        $search: String
        $woredaId: ID
        $teamId: ID!
        $regionId: ID
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
                woredaId: $woredaId
                teamId: $teamId
                regionId: $regionId
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

    // Note: the value represents gender enum in query
    const genderOptions = [
        {
            key: 'MALE',
            label: 'Male',
            value: 10,
        },
        {
            key: 'FEMALE',
            label: 'Female',
            value: 20,
        },
        {
            key: 'OTHER',
            label: 'Other',
            value: 30,
        },
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
            <Container
                pending={fetching}
                withPadding
                headerActions={(
                    <Button
                        name="export"
                        before={<DownloadTwoFillIcon />}
                    >
                        Export
                    </Button>
                )}
                filters={(
                    <>
                        <SelectInput
                            placeholder="Gender"
                            name="sex"
                            options={genderOptions}
                            keySelector={(option) => option.key}
                            labelSelector={(option) => option.label}
                            value={filter.sex}
                            onChange={setFilterField}
                        />
                        <TextInput
                            name="searchText"
                            placeholder="Search"
                            value={rawFilter.searchText}
                            onChange={setFilterField}
                            icons={<SearchLineIcon />}
                        />
                    </>
                )}
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
        </Page>
    );
}

export default Members;
