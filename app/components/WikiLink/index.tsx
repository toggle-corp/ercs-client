import { WikiHelpSectionLineIcon } from '@ifrc-go/icons';
import { _cs } from '@togglecorp/fujs';

import Link from '#components/Link';

import styles from './styles.module.css';

interface Props {
    pathName: string;
    className?: string;
}

function WikiLink(props: Props) {
    const {
        pathName,
        className,
    } = props;

    return (
        <Link
            className={_cs(styles.wikiLink, className)}
            href={`https://go-wiki.ifrc.org/en/${pathName}`}
            title="GO Wiki"
            external
            withoutPadding
        >
            <WikiHelpSectionLineIcon className={styles.icon} />
        </Link>
    );
}

export default WikiLink;
