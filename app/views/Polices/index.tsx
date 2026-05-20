import { ListView } from '@ifrc-go/ui';

import DocumentCard from '#components/DocumentCard';
import Link from '#components/Link';
import Page from '#components/Page';

// TODO: Fetch the data from server
const policies = [
    {
        title: 'Title 1',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
    },
    {
        title: 'Title 2',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
    },
    {
        title: 'Title 3',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
    },
    {
        title: 'Title 4',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
    },
    {
        title: 'Title 5',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
    },
    {
        title: 'Title 6',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
        url: 'http://localhost:8000/media/reports/MDRNP008f_efr.pdf',
    },

];

function Policies() {
    return (
        <Page
            heading="Policies"
            description="Repository of organizational policies designed to ensure compliance, accountability, and effective operational management"
        >
            <ListView
                layout="grid"
                numPreferredGridColumns={5}
            >
                {policies.map((policy) => (
                    <Link
                        href={policy.url}
                        external
                        withFullWidth
                    >
                        <DocumentCard manual={policy} />
                    </Link>
                ))}
            </ListView>
        </Page>
    );
}

export default Policies;
