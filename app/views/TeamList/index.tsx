import { Table } from '@ifrc-go/ui';
import {
    createElementColumn,
    createStringColumn,
} from '@ifrc-go/ui/utils';
import { gql } from 'urql';

import Link from '#components/Link';
import Page from '#components/Page';
import {
    type TeamListQuery,
    useTeamListQuery,
} from '#generated/types/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TEAMS_QUERY = gql`
 query TeamList {
  teams {
    results {
      id
      name
    }
  }
}
`;
const teamKeySelector = (item: TeamList) => item.id;

type TeamList = NonNullable<TeamListQuery['teams']['results']>[number];

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
    const [{ data, fetching }] = useTeamListQuery();

    const columns = [
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
            heading="Teams"
            description="A dedicated team committed to delivering impactful solutions."
        >
            <Table
                keySelector={teamKeySelector}
                columns={columns}
                data={data?.teams.results ?? []}
                filtered={false}
                pending={fetching}
            />
        </Page>
    );
}

export default TeamList;
