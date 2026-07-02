import { ToolsLineIcon } from '@ifrc-go/icons';
import {
    Description,
    Heading,
} from '@ifrc-go/ui';

import styles from './styles.module.css';

function Pmer() {
    return (
        <div className={styles.pmer}>
            <ToolsLineIcon className={styles.icon} />
            <Heading level={3}>
                Under Construction
            </Heading>
            <Description>
                The PMER dashboard is currently being built. Please check back later.
            </Description>
        </div>
    );
}

export default Pmer;
