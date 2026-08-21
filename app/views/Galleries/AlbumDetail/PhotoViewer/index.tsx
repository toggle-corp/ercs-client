import {
    useCallback,
    useEffect,
    useRef,
} from 'react';
import {
    ChevronLeftLineIcon,
    ChevronRightLineIcon,
    CloseLineIcon,
} from '@ifrc-go/icons';
import {
    Image,
    Portal,
    RawButton,
    Spinner,
} from '@ifrc-go/ui';
import {
    isNotDefined,
    isTruthyString,
} from '@togglecorp/fujs';

import styles from './styles.module.css';

const SWIPE_THRESHOLD = 50;

interface Props {
    imageUrls: string[] | undefined;
    index: number;
    totalCount: number;
    pending: boolean;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}

function PhotoViewer(props: Props) {
    const {
        imageUrls,
        index,
        totalCount,
        pending,
        onIndexChange,
        onClose,
    } = props;

    const touchStartXRef = useRef<number>(undefined);
    const swipedRef = useRef(false);

    const hasPrev = isTruthyString(imageUrls?.[index - 1]);
    const hasNext = isTruthyString(imageUrls?.[index + 1]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (isNotDefined(imageUrls)) {
                return;
            }
            if (event.key === 'ArrowLeft' && index > 0) {
                onIndexChange(index - 1);
            }
            if (event.key === 'ArrowRight' && index < imageUrls.length - 1) {
                onIndexChange(index + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [index, imageUrls, onIndexChange, onClose]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const handleTouchStart = useCallback(
        (event: React.TouchEvent<HTMLDivElement>) => {
            touchStartXRef.current = event.touches[0]?.clientX;
        },
        [],
    );

    const handleTouchEnd = useCallback(
        (event: React.TouchEvent<HTMLDivElement>) => {
            const startX = touchStartXRef.current;
            touchStartXRef.current = undefined;

            const endX = event.changedTouches[0]?.clientX;
            if (isNotDefined(startX) || isNotDefined(endX) || isNotDefined(imageUrls)) {
                return;
            }

            const travel = endX - startX;
            if (Math.abs(travel) < SWIPE_THRESHOLD) {
                return;
            }
            // NOTE: a swipe over the backdrop should not be read as a click
            swipedRef.current = true;
            if (travel < 0 && index < imageUrls.length - 1) {
                onIndexChange(index + 1);
            } else if (travel > 0 && index > 0) {
                onIndexChange(index - 1);
            }
        },
        [imageUrls, index, onIndexChange],
    );

    const handleBackdropClick = useCallback(
        () => {
            if (swipedRef.current) {
                swipedRef.current = false;
                return;
            }
            onClose();
        },
        [onClose],
    );

    const src = imageUrls?.[index];

    return (
        <Portal>
            <div
                className={styles.photoViewer}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                role="dialog"
                aria-modal
                aria-label="photo viewer"
            >
                <RawButton
                    name={undefined}
                    className={styles.backdrop}
                    onClick={handleBackdropClick}
                    tabIndex={-1}
                    aria-label="close photo viewer"
                    title="close"
                />
                <RawButton
                    name={undefined}
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="close photo viewer"
                    title="close"
                >
                    <CloseLineIcon />
                </RawButton>
                <div className={styles.stage}>
                    <RawButton
                        name={index - 1}
                        className={styles.navButton}
                        disabled={!hasPrev}
                        onClick={onIndexChange}
                        aria-label="previous photo"
                        title="previous photo"
                    >
                        <ChevronLeftLineIcon />
                    </RawButton>
                    <div className={styles.imageContainer}>
                        {pending && <Spinner className={styles.spinner} />}
                        {!pending && isTruthyString(src) && (
                            <Image
                                src={src}
                                alt={`photo ${index + 1} of ${totalCount}`}
                                className={styles.image}
                                imgElementClassName={styles.imageElement}
                                withContainedFit
                                withoutBackground
                                withoutCaption
                            />
                        )}
                    </div>
                    <RawButton
                        name={index + 1}
                        className={styles.navButton}
                        disabled={!hasNext}
                        onClick={onIndexChange}
                        aria-label="next photo"
                        title="next photo"
                    >
                        <ChevronRightLineIcon />
                    </RawButton>
                </div>
                <div className={styles.counter}>
                    {`${index + 1} / ${totalCount}`}
                </div>
            </div>
        </Portal>
    );
}

export default PhotoViewer;
