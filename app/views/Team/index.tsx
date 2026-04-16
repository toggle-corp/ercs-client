import { useParams } from 'react-router';
import { DownloadTwoFillIcon } from '@ifrc-go/icons';
import {
    Button,
    Container,
    Description,
    Heading,
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

import styles from './styles.module.css';

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

function Team() {
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
    function idSelector<T>(item: { id: T }) {
        return item.id;
    }

    return (
        <Page
            heading="Teams"
            description="A dedicated team committed to delivering impactful solutions."
            info={(
                <ListView withCenteredContents>
                    <Description>
                        <i>5 Teams • 85 Members • 81 Active</i>
                    </Description>
                </ListView>
            )}
        >
            <ListView layout="block" className={styles.container}>
                <ListView
                    withDarkBackground
                    withSpaceBetweenContents
                    withFullWidth
                    withPadding
                    className={styles.header}
                >
                    <ListView layout="block" spacing="2xs">
                        <Heading level={4} className={styles.teamName}>
                            {data?.team.name}
                        </Heading>
                        <Description>
                            <i>123 Members • 5 Regions • 21 Active</i>
                        </Description>
                    </ListView>
                    <Button name="export" before={<DownloadTwoFillIcon />}>
                        Export
                    </Button>
                </ListView>
                <Container
                    pending={fetching}
                    withPadding
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
            </ListView>
        </Page>
    );
}

export default Team;
