import { ListView } from '@ifrc-go/ui';

import DocumentCard from '#components/DocumentCard';
import Link from '#components/Link';
import Page from '#components/Page';

// TODO: Fetch the data from server
const onlineInteractive = [
    {
        title: 'Title 1',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
        url: 'http://localhost:8000/media/reports/MDRNP008f_efr.pdf',
        date: '2024-01-01',
    },
    {
        title: 'Title 2',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
        url: 'http://localhost:8000/media/reports/MDRNP008f_efr.pdf',
        date: '2024-01-01',
    },
    {
        title: 'Title 3',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
        url: 'http://localhost:8000/media/reports/MDRNP008f_efr.pdf',
        date: '2024-01-01',
    },
    {
        title: 'Title 4',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
        url: 'http://localhost:8000/media/reports/MDRNP008f_efr.pdf',
        date: '2024-01-01',
    },
    {
        title: 'Title 5',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
        url: 'http://localhost:8000/media/reports/MDRNP008f_efr.pdf',
        date: '2024-01-01',
    },
    {
        title: 'Title 6',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
        url: 'http://localhost:8000/media/reports/MDRNP008f_efr.pdf',
        date: '2024-01-01',
    },

];

function OnlineInteractive() {
    return (
        <Page
            heading="Online Interactive"
            description="Find interactive online materials and learning experiences designed to improve accessibility and engagement"
        >
            <ListView
                layout="grid"
                numPreferredGridColumns={5}
            >
                {onlineInteractive.map((resource) => (
                    <Link
                        href={resource.url}
                        external
                        withFullWidth
                    >
                        <DocumentCard manual={resource} />
                    </Link>
                ))}
            </ListView>
        </Page>
    );
}

export default OnlineInteractive;
