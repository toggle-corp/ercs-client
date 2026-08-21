import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    CheckLineIcon,
    CopyLineIcon,
    SocialFacebookIcon,
    SocialLinkedinIcon,
} from '@ifrc-go/icons';
import {
    Button,
    ListView,
} from '@ifrc-go/ui';
import { _cs } from '@togglecorp/fujs';

import Link from '#components/Link';
import WhatsappIcon from '#components/WhatsappIcon';
import XIcon from '#components/XIcon';

import styles from './styles.module.css';

const COPIED_FEEDBACK_DURATION = 2000;

interface Props {
    className?: string;
    label?: React.ReactNode;
    url?: string;
    title?: string;
}

function SocialShare(props: Props) {
    const {
        className,
        label = 'Share on:',
        url,
        title,
    } = props;

    const copiedTimeoutRef = useRef<number | undefined>(undefined);
    const [copied, setCopied] = useState(false);

    const {
        shareLink,
        facebookUrl,
        linkedinUrl,
        twitterUrl,
        whatsappUrl,
    } = useMemo(
        () => {
            const link = url ?? window.location.href;
            const shareUrl = encodeURIComponent(link);
            const shareTitle = encodeURIComponent(title ?? document.title);

            return {
                shareLink: link,
                facebookUrl: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                linkedinUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                twitterUrl: `https://x.com/intent/post?url=${shareUrl}&text=${shareTitle}`,
                whatsappUrl: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
            };
        },
        [url, title],
    );

    const handleCopyClick = useCallback(
        () => {
            navigator.clipboard.writeText(shareLink).then(() => {
                setCopied(true);
                window.clearTimeout(copiedTimeoutRef.current);
                copiedTimeoutRef.current = window.setTimeout(() => {
                    setCopied(false);
                }, COPIED_FEEDBACK_DURATION);
            });
        },
        [shareLink],
    );

    useEffect(() => () => {
        window.clearTimeout(copiedTimeoutRef.current);
    }, []);

    return (
        <ListView
            className={_cs(styles.socialShare, className)}
            spacing="sm"
            withCenteredContents
        >
            <div className={styles.label}>
                {label}
            </div>
            <Link
                className={styles.socialIcon}
                href={facebookUrl}
                external
                title="Share on Facebook"
                aria-label="Share on Facebook"
            >
                <SocialFacebookIcon />
            </Link>
            <Link
                className={styles.socialIcon}
                href={linkedinUrl}
                external
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
                textSize="lg"
            >
                <SocialLinkedinIcon />
            </Link>
            <Link
                className={styles.socialIcon}
                href={twitterUrl}
                external
                title="Share on X"
                aria-label="Share on X"
            >
                <XIcon />
            </Link>
            <Link
                className={styles.socialIcon}
                href={whatsappUrl}
                external
                title="Share on WhatsApp"
                aria-label="Share on WhatsApp"
            >
                <WhatsappIcon />
            </Link>
            <Button
                name={undefined}
                onClick={handleCopyClick}
                title={copied ? 'Link copied' : 'Copy link'}
                aria-label={copied ? 'Link copied' : 'Copy link'}
                styleVariant="action"
            >
                <div className={styles.socialIcon}>
                    {copied ? <CheckLineIcon /> : <CopyLineIcon />}
                </div>
            </Button>
        </ListView>
    );
}

export default SocialShare;
