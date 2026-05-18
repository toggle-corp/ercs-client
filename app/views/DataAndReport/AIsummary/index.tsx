import { StarLineIcon } from '@ifrc-go/icons';
import {
    Description,
    Heading,
    InlineView,
    ListView,
} from '@ifrc-go/ui';

import styles from './styles.module.css';

function AIsummary() {
    // TODO: fetch ai summary data from backend and display here
    return (
        <ListView
            layout="block"
            withPadding
            className={styles.aiSummary}
            spacing="2xl"
        >
            <InlineView
                before={<StarLineIcon width={24} height={24} />}
                spacing="sm"
                contentAlignment="center"
            >
                <Heading level={2}>AI Summary</Heading>
            </InlineView>
            <Description textSize="lg">
                A cholera outbreak was declared in Arsi Zone,
                Ethiopia on 17 May 2025 and is spreading to nearby areas.
                By mid-June, 201 cases (92% severe) and 2 deaths were reported.
                The outbreak is rapidly increasing, with over 62,000 people in need of assistance.
            </Description>
            <Description textSize="lg">
                A cholera outbreak was declared in Arsi Zone,
                Ethiopia on 17 May 2025 and is spreading to nearby areas.
                By mid-June, 201 cases (92% severe) and 2 deaths were reported.
                The outbreak is rapidly increasing, with over 62,000 people in need of assistance.
            </Description>
            <Description textSize="lg">
                A cholera outbreak was declared in Arsi Zone,
                Ethiopia on 17 May 2025 and is spreading to nearby areas.
                By mid-June, 201 cases (92% severe) and 2 deaths were reported.
                The outbreak is rapidly increasing, with over 62,000 people in need of assistance.
            </Description>
            <Description textSize="lg">
                A cholera outbreak was declared in Arsi Zone,
                Ethiopia on 17 May 2025 and is spreading to nearby areas.
                By mid-June, 201 cases (92% severe) and 2 deaths were reported.
                The outbreak is rapidly increasing, with over 62,000 people in need of assistance.
            </Description>
            <Description textSize="lg">
                A cholera outbreak was declared in Arsi Zone,
                Ethiopia on 17 May 2025 and is spreading to nearby areas.
                By mid-June, 201 cases (92% severe) and 2 deaths were reported.
                The outbreak is rapidly increasing, with over 62,000 people in need of assistance.
            </Description>

        </ListView>
    );
}

export default AIsummary;
