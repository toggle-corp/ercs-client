import DocumentListPage from '#components/DocumentList';
import { ReportTypeEnum } from '#generated/types/graphql';

function Policies() {
    return (
        <DocumentListPage
            reportType={ReportTypeEnum.Policy}
            heading="Policies"
            description="Repository of organizational policies designed to ensure compliance, accountability, and effective operational management"
        />
    );
}

export default Policies;
