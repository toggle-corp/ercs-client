import DocumentListPage from '#components/DocumentList';
import { ReportTypeEnum } from '#generated/types/graphql';

function Manuals() {
    return (
        <DocumentListPage
            reportType={ReportTypeEnum.Manual}
            heading="Manuals"
            description="Operational manuals and reference guides for field and headquarters staff"
        />
    );
}

export default Manuals;
