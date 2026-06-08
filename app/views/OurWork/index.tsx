import { Outlet } from 'react-router';
import {
    AlertLineIcon,
    HeartAddLineIcon,
    ShieldUserLineIcon,
} from '@ifrc-go/icons';
import {
    Container,
    ListView,
    NavigationTabList,
} from '@ifrc-go/ui';
import { gql } from 'urql';

import KeyCard from '#components/KeyCard';
import NavigationTab from '#components/NavigationTab';
import Page from '#components/Page';
import RegionSelectInput from '#components/RegionSelectInput';

// NOTE: There is limit of 20 dashboards for now, as we don't have more than that.
// We can add pagination if needed in the future

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EXTERNAL_DASHBOARDS_QUERY = gql`
    query ExternalDashboards(
        $page: DashboardPage
        $isActive: Boolean = true
        $limit: Int = 20
        $offset: Int = 0
    ) {
        externalDashboards(
            filters: { page: $page, isActive: $isActive }
            pagination: { limit: $limit, offset: $offset }
        ) {
            results {
                title
                updatedAt
                order
                id
                isActive
                createdAt
                description
                page
                regionId
                showOnHome
                url
            }
            pageInfo {
                limit
                offset
            }
            totalCount
        }
    }
`;

// TODO: Fetch real data for key figures and operations

const keyFigures = (
    <ListView
        layout="grid"
        numPreferredGridColumns={3}
    >
        <KeyCard
            icon={<HeartAddLineIcon />}
            value={250}
            valueType="number"
            size="lg"
            label="People Reached"
            info="in last 30 days"
        />
        <KeyCard
            icon={<AlertLineIcon />}
            value={18}
            valueType="number"
            size="lg"
            valueOptions={{ compact: true }}
            label="Population Affected"
            info="in last 30 days"
        />
        <KeyCard
            icon={<ShieldUserLineIcon />}
            value={18}
            valueType="number"
            size="lg"
            label="People in Need"
            info="in last 30 days"
        />
    </ListView>
);

function OurWork() {
    return (
        <Page
            heading="National EOC Operations"
            description="Comprehensive operational intelligence and emergency coordination dashboards"
            info={(
                <Container>
                    {keyFigures}
                </Container>
            )}
            actions={(
                // TODO: add region filter
                <RegionSelectInput
                    name="region"
                    value={undefined}
                    onChange={() => {}}
                />
            )}
        >
            <ListView
                layout="block"
                spacing="xl"
            >
                <NavigationTabList>
                    <NavigationTab
                        to="emergencyResponse"
                    >
                        Emergency Response
                    </NavigationTab>
                    <NavigationTab
                        to="projectMapping"
                    >
                        Project Mapping
                    </NavigationTab>

                </NavigationTabList>
                <Outlet />
            </ListView>
        </Page>
    );
}

export default OurWork;
