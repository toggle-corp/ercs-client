import {
    SocialFacebookIcon,
    SocialInstagramIcon,
    SocialLinkedinIcon,
    SocialMediumIcon,
    SocialTwitterIcon,
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
                            © ERCS EOC
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
                            to="cookie"
                        >
                            Cookie Policy
                        </Link>
                        <Link
                            colorVariant="text-on-dark"
                            to="termsAndConditions"
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
                            to="projectMapping"
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
                            href="mailto:ercsinfo@redcrosseth.org"
                            colorVariant="primary"
                            styleVariant="filled"
                            external
                            withLinkIcon
                            textSize="sm"
                            spacing="xs"
                        >
                            ercsinfo@redcrosseth.org
                        </Link>
                        <ListView spacing="sm">
                            <Link
                                className={styles.socialIcon}
                                href="https://x.com/ethioredcross"
                                external
                                colorVariant="text-on-dark"
                            >
                                {/* TODO: change twitter icon in ifrc go icon to X */}
                                <SocialTwitterIcon />
                            </Link>
                            <Link
                                className={styles.socialIcon}
                                href="https://www.facebook.com/EthiopianRedCross"
                                external
                                colorVariant="text-on-dark"
                            >
                                <SocialFacebookIcon />
                            </Link>
                            <Link
                                className={styles.socialIcon}
                                href="https://www.flickr.com/people/137615657@N05/"
                                external
                                colorVariant="text-on-dark"
                            >
                                {/* TODO: add flickr icon in ifrc go icon */}
                                <SocialMediumIcon />
                            </Link>
                            <Link
                                className={styles.socialIcon}
                                href="https://www.linkedin.com/company/ethiopian-red-cross-society/"
                                external
                                colorVariant="text-on-dark"
                            >
                                <SocialLinkedinIcon />
                            </Link>

                            <Link
                                className={styles.socialIcon}
                                href="https://www.youtube.com/channel/UCpGN4FZcstRlR5PvhNWzCFw"
                                external
                                colorVariant="text-on-dark"
                            >
                                <SocialYoutubeIcon />
                            </Link>

                            <Link
                                className={styles.socialIcon}
                                href="https://www.instagram.com/ercs1935?igsh=cjJtbGhtcnFkNnMw"
                                external
                                colorVariant="text-on-dark"
                            >
                                <SocialInstagramIcon />
                            </Link>

                        </ListView>
                    </ListView>
                </Container>
            </ListView>
        </PageContainer>
    );
}

export default GlobalFooter;
