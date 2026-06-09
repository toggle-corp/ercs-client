import DocumentListPage from '#components/DocumentList';
import { ReportTypeEnum } from '#generated/types/graphql';

function OnlineInteractive() {
    return (
        <DocumentListPage
            reportType={ReportTypeEnum.OnlineInteractive}
            heading="Online Interactive"
            description="Find interactive online materials and learning experiences designed to improve accessibility and engagement"
        />
    );
}

export default OnlineInteractive;
