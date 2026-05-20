import { ListView } from '@ifrc-go/ui';

import DocumentCard from '#components/DocumentCard';
import Link from '#components/Link';
import Page from '#components/Page';

// TODO: Fetch the data from server
const guidelines = [
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
        src: 'https://ercs-1-minio.ifrc-go.dev.togglecorp.com/ercs-media/media/reports/covers/Cholera-outbreak-update-as-of-July-2024-300x135.png',
    },
    {
        title: 'Title 5',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/Drug.png',
    },
    {
        title: 'Title 6',
        src: 'https://eoc-ercs.redcrosseth.org/wp-content/uploads/2023/11/1_11zon-276x300.jpg',
        url: 'http://localhost:8000/media/reports/MDRNP008f_efr.pdf',
    },

];

function Guidelines() {
    return (
        <Page
            heading="Guidelines"
            description="Access practical guidelines and procedural references that support consistent implementation and operational best practices"
        >
            <ListView
                layout="grid"
                numPreferredGridColumns={5}
            >
                {guidelines.map((guideline) => (
                    <Link
                        href={guideline.url}
                        external
                        withFullWidth
                    >
                        <DocumentCard manual={guideline} />
                    </Link>
                ))}
            </ListView>
        </Page>
    );
}

export default Guidelines;
