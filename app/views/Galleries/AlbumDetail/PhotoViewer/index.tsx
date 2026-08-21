import {
    useCallback,
    useEffect,
    useRef,
} from 'react';
import {
    ChevronLeftLineIcon,
    ChevronRightLineIcon,
} from '@ifrc-go/icons';
import {
    IconButton,
    Image,
    Modal,
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

    const hasPrev = isTruthyString(imageUrls?.[index - 1]);
    const hasNext = isTruthyString(imageUrls?.[index + 1]);

    useEffect(() => {
        if (isNotDefined(imageUrls)) {
            return undefined;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' && index > 0) {
                onIndexChange(index - 1);
            }
            if (event.key === 'ArrowRight' && index < imageUrls.length - 1) {
                onIndexChange(index + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [index, imageUrls, onIndexChange]);

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
            if (travel < 0 && index < imageUrls.length - 1) {
                onIndexChange(index + 1);
            } else if (travel > 0 && index > 0) {
                onIndexChange(index - 1);
            }
        },
        [imageUrls, index, onIndexChange],
    );

    const src = imageUrls?.[index];

    return (
        <Modal
            closeOnClickOutside
            closeOnEscape
            onClose={onClose}
            size="full"
            footerIcons={(
                <IconButton
                    name={index - 1}
                    ariaLabel="previous photo"
                    title="previous photo"
                    round={false}
                    variant="secondary"
                    disabled={!hasPrev}
                    onClick={onIndexChange}
                >
                    <ChevronLeftLineIcon />
                </IconButton>
            )}
            footer={pending
                ? `${index + 1} / ${totalCount} · loading…`
                : `${index + 1} / ${totalCount}`}
            footerActions={(
                <IconButton
                    name={index + 1}
                    ariaLabel="next photo"
                    title="next photo"
                    round={false}
                    variant="secondary"
                    disabled={!hasNext}
                    onClick={onIndexChange}
                >
                    <ChevronRightLineIcon />
                </IconButton>
            )}
        >
            <div
                className={styles.imageContainer}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <Image
                    src={src}
                    alt={src}
                    className={styles.image}
                    imgElementClassName={styles.imageElement}
                    withContainedFit
                    withoutCaption
                />
            </div>
        </Modal>
    );
}

export default PhotoViewer;
