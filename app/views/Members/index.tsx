import { useParams } from 'react-router';
import { DownloadTwoFillIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    ListView,
    SelectInput,
    Table,
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
    type TeamQuery,
    useTeamQuery,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TEAM_QUERY = gql`
  query Team($pk: ID!) {
    team(pk: $pk) {
      members {
        teamId
        position
        phoneNumber
        order
        name
        id
        email
      }
      id
      name
      description
    }
  }
`;
function idSelector<T>(item: { id: T }) {
    return item.id;
}

type MemberList = NonNullable<TeamQuery['team']['members']>[number];

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

    const [{ fetching, data }] = useTeamQuery({
        variables: { pk: id! },
        pause: !id,
    });

    const { sortState } = useFilterState({
        filter: {},
        pageSize: 15,
    });

    const columns = [
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
        createStringColumn<MemberList, string | number>(
            'phoneNumber',
            'Phone Number',
            (dept) => dept?.phoneNumber,
            { sortable: true },
        ),
        createStringColumn<MemberList, string | number>(
            'position',
            'Position',
            (dept) => dept?.position,
            { sortable: true },
        ),
    ];

    return (
        <Page
            heading={data?.team.name}
            description={(
                <i>
                    {data?.team.members?.length}
                    {' '}
                    Members
                </i>
            )}
        >
            <Container
                pending={fetching}
                withPadding
                headerActions={(
                    <Button name="export" before={<DownloadTwoFillIcon />}>
                        Export
                    </Button>
                )}
                filters={(
                    <SelectInput
                        name="sex"
                        options={[]}
                        keySelector={(option) => option}
                        labelSelector={(option) => option}
                        value="Temp"
                        onChange={() => { }}
                    />
                )}
            >
                <SortContext.Provider value={sortState}>
                    <Table
                        keySelector={idSelector}
                        columns={columns}
                        data={data?.team.members}
                        filtered={false}
                        pending={fetching}
                    />
                </SortContext.Provider>
            </Container>
        </Page>
    );
}

export default Members;
