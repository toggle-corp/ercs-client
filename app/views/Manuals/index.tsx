import { ListView } from '@ifrc-go/ui';

import DocumentCard from '#components/DocumentCard';
import Link from '#components/Link';
import Page from '#components/Page';

// TODO: Fetch the data from server
const manuals = [
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

function Manuals() {
    return (
        <Page
            heading="Manuals"
            description="Centralized collection of manuals, procedures, and documentation for easy access and team reference"
        >
            <ListView
                layout="grid"
                numPreferredGridColumns={5}
            >
                {manuals.map((manual) => (
                    <Link
                        href={manual.url}
                        external
                        withFullWidth
                    >
                        <DocumentCard manual={manual} />
                    </Link>
                ))}
            </ListView>
        </Page>
    );
}

export default Manuals;
