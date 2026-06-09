import DocumentListPage from '#components/DocumentList';
import { ReportTypeEnum } from '#generated/types/graphql';

function Guidelines() {
    return (
        <DocumentListPage
            reportType={ReportTypeEnum.Guideline}
            heading="Guidelines"
            description="Access practical guidelines and procedural references that support consistent implementation and operational best practices"
        />

    );
}

export default Guidelines;
