import {
    SocialFacebookIcon,
    SocialMediumIcon,
    SocialYoutubeIcon,
} from '@ifrc-go/icons';
import {
    Container,
    ListView,
    PageContainer,
} from '@ifrc-go/ui';
import { _cs } from '@togglecorp/fujs';

import Link from '#components/Link';

import styles from './styles.module.css';

const date = new Date();
const year = date.getFullYear();

interface Props {
    className?: string;
}

function GlobalFooter(props: Props) {
    const {
        className,
    } = props;
    return (
        <PageContainer
            className={_cs(styles.footer, className)}
            contentClassName={styles.content}
            containerAs="footer"
        >
            <ListView
                layout="grid"
                numPreferredGridColumns={5}
                spacing="xl"
                minGridColumnSize="14rem"
            >
                <Container
                    heading="About ERCS EOC"
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <div className={styles.description}>
                            ERCS EOC is a Ethiopian Red Cross platform to connect
                            information on emergency
                            needs with the right response.
                        </div>
                        <div className={styles.copyright}>
                            © IFRC
                            {' '}
                            {year}
                        </div>
                    </ListView>
                </Container>
                <Container
                    heading="Find Out More"
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <Link
                            href="https://ifrc.org"
                            external
                            colorVariant="text-on-dark"
                        >
                            ifrc.org
                        </Link>
                        <Link
                            href="https://rcrcsims.org"
                            external
                            colorVariant="text-on-dark"
                        >
                            rcrcsims.org
                        </Link>
                        <Link
                            href="https://data.ifrc.org"
                            external
                            colorVariant="text-on-dark"
                        >
                            data.ifrc.org
                        </Link>
                    </ListView>
                </Container>
                <Container
                    heading="Policies"
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <Link
                            colorVariant="text-on-dark"
                            route="cookie"
                        >
                            Cookie Policy
                        </Link>
                        <Link
                            colorVariant="text-on-dark"
                            route="termsAndConditions"
                        >
                            Terms and Conditions
                        </Link>
                    </ListView>
                </Container>
                <Container
                    heading="Quick Link"
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <Link
                            href="https://github.com/ifrcgo/go-web-app"
                            external
                            colorVariant="text-on-dark"
                        >
                            Dataset
                        </Link>
                        <Link
                            href="https://github.com/ifrcgo/go-web-app"
                            external
                            colorVariant="text-on-dark"
                        >
                            Project Mapping
                        </Link>
                        <Link
                            href="https://github.com/ifrcgo/go-web-app"
                            colorVariant="text-on-dark"
                            external
                        >
                            Online Interactive
                        </Link>
                    </ListView>
                </Container>
                <Container
                    heading="Contact Us"
                    spacing="lg"
                >
                    <ListView
                        layout="block"
                        withSpacingOpticalCorrection
                    >
                        <Link
                            href="mailto:im@ifrc.org"
                            colorVariant="primary"
                            styleVariant="filled"
                            external
                            withLinkIcon
                        >
                            im@ifrc.org
                        </Link>
                        <ListView spacing="sm">
                            <Link
                                className={styles.socialIcon}
                                href="https://ifrcgoproject.medium.com"
                                external
                                colorVariant="text-on-dark"
                            >
                                <SocialMediumIcon />
                            </Link>
                            <Link
                                className={styles.socialIcon}
                                href="https://www.facebook.com/IFRC"
                                external
                                colorVariant="text-on-dark"
                            >
                                <SocialFacebookIcon />
                            </Link>
                            <Link
                                className={styles.socialIcon}
                                href="https://www.youtube.com/watch?v=dwPsQzla9A4"
                                external
                                colorVariant="text-on-dark"
                            >
                                <SocialYoutubeIcon />
                            </Link>
                        </ListView>
                    </ListView>
                </Container>
            </ListView>
        </PageContainer>
    );
}

export default GlobalFooter;
