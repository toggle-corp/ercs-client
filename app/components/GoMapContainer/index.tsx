import {
    useCallback,
    useEffect,
    useRef,
} from 'react';
import {
    ArtboardLineIcon,
    CloseFillIcon,
    CloseLineIcon,
    DownloadTwoLineIcon,
} from '@ifrc-go/icons';
import {
    Button,
    Container,
    DateOutput,
    IconButton,
    InfoPopup,
    Label,
    ListView,
    RawButton,
} from '@ifrc-go/ui';
import { useBooleanState } from '@ifrc-go/ui/hooks';
import { resolveToComponent } from '@ifrc-go/ui/utils';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import { MapContainer } from '@togglecorp/re-map';
import FileSaver from 'file-saver';
import { toPng } from 'html-to-image';

import Link from '#components/Link';
import useAlert from '#hooks/useAlert';
import goLogo from '#resources/image/logo.png';

import styles from './styles.module.css';

interface Props {
    className?: string;
    title: string;
    footer?: React.ReactNode;
    withoutDownloadButton?: boolean;
    withPresentationMode?: boolean;
    presentationModeAdditionalBeforeContent?: React.ReactNode;
    presentationModeAdditionalAfterContent?: React.ReactNode;
    onPresentationModeChange?: (newPresentationMode: boolean) => void;
    children?: React.ReactNode;
}

function GoMapContainer(props: Props) {
    const mbToken = import.meta.env.APP_MAPBOX_TOKEN;
    const {
        className,
        title = 'IFRC GO - Map',
        footer,
        withoutDownloadButton = false,
        withPresentationMode = false,
        presentationModeAdditionalBeforeContent,
        presentationModeAdditionalAfterContent,
        onPresentationModeChange,
        children,
    } = props;

    const mapSources = resolveToComponent(
        'Sources: ICRC,',
        {
            uncodsLink: (
                <Link
                    href="https://cod.unocha.org/"
                    external
                    withLinkIcon
                    spacing="xs"
                >
                    UNCODs
                </Link>
            ),
        },
    );

    const [
        printMode,
        {
            setTrue: enterPrintMode,
            setFalse: exitPrintMode,
        },
    ] = useBooleanState(false);

    const [
        presentationMode,
        {
            setTrue: setPresentationModeTrue,
            setFalse: setPresentationModeFalse,
        },
    ] = useBooleanState(false);

    const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

    const enterPresentationMode = useCallback(() => {
        if (isDefined(containerRef.current)) {
            containerRef.current.requestFullscreen();
        }
    }, []);

    const exitPresentationMode = useCallback(() => {
        if (isDefined(document.fullscreenElement)) {
            document.exitFullscreen();
        }
    }, []);

    const handleFullScreenChange = useCallback(() => {
        if (isDefined(document.fullscreenElement)) {
            setPresentationModeTrue();
        } else {
            setPresentationModeFalse();
        }
    }, [setPresentationModeTrue, setPresentationModeFalse]);

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullScreenChange);

        return (() => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        });
    }, [handleFullScreenChange]);

    useEffect(() => {
        if (isDefined(onPresentationModeChange)) {
            onPresentationModeChange(presentationMode);
        }
    }, [presentationMode, onPresentationModeChange]);

    const alert = useAlert();
    const handleDownloadClick = useCallback(() => {
        if (!containerRef?.current) {
            alert.show(
                'Failed to download map. Try again.',
                { variant: 'danger' },
            );
            exitPrintMode();
            return;
        }
        toPng(containerRef.current, { skipAutoScale: false })
            .then((data) => FileSaver.saveAs(data, title))
            .finally(exitPrintMode);
    }, [exitPrintMode, title, alert]);

    return (
        <Container
            elementRef={containerRef}
            pending={false}
            errored={false}
            empty={false}
            filtered={false}
            className={_cs(
                styles.goMapContainer,
                printMode && styles.printMode,
                presentationMode && styles.presentationMode,
                className,
            )}
            headingLevel={2}
            heading={(presentationMode || printMode) && (
                <ListView
                    withPadding={printMode}
                    withSpacingOpticalCorrection
                >
                    {title}
                    <DateOutput
                        className={styles.headerDate}
                        value={(new Date()).toDateString()}
                    />
                </ListView>
            )}
            headerActions={(
                <>
                    {printMode && (
                        <Container
                            className={styles.floatingActions}
                            withShadow
                            withBackground
                            withPadding
                        >
                            <ListView>
                                <Button
                                    name={undefined}
                                    onClick={handleDownloadClick}
                                    before={(
                                        <DownloadTwoLineIcon />
                                    )}
                                >
                                    Download
                                </Button>
                                <IconButton
                                    name={undefined}
                                    title="Exit print mode"
                                    ariaLabel="Exit print mode"
                                    onClick={exitPrintMode}
                                    variant="secondary"
                                >
                                    <CloseFillIcon />
                                </IconButton>
                            </ListView>
                        </Container>
                    )}
                    {presentationMode && (
                        <IconButton
                            name={undefined}
                            onClick={exitPresentationMode}
                            title="Exit presentation mode"
                            ariaLabel="Exit presentation mode"
                            variant="secondary"
                        >
                            <CloseLineIcon />
                        </IconButton>
                    )}
                    {printMode && (
                        <ListView
                            withPadding
                            withSpacingOpticalCorrection
                        >
                            <img
                                className={styles.goIcon}
                                src={goLogo}
                                alt="IFRC GO logo"
                            />
                        </ListView>
                    )}
                </>
            )}
            spacing={presentationMode ? 'xl' : 'none'}
            withPadding={presentationMode}
        >
            <ListView
                layout="block"
                spacing={presentationMode ? 'lg' : 'none'}
            >
                {presentationMode && presentationModeAdditionalBeforeContent}
                <div className={styles.relativeWrapper}>
                    <MapContainer className={styles.map} />
                    <InfoPopup
                        infoLabel="Sources: ICRC, UN CODs"
                        className={styles.mapDisclaimer}
                        description={(
                            <ListView
                                layout="block"
                                withSpacingOpticalCorrection
                                spacing="sm"
                            >
                                <Label>
                                    The maps used do not imply the expression of
                                    any opinion on the part of the International
                                    Federation of Red Cross and Red Crescent Societies
                                    or National Society concerning the legal status
                                    of a territory or of its authorities.
                                </Label>
                                <ListView
                                    withSpacingOpticalCorrection
                                    spacing="xs"
                                    withWrap
                                >
                                    {mapSources}
                                </ListView>
                                <ListView
                                    className="mapboxgl-ctrl-attrib-inner"
                                    spacing="xs"
                                    withSpacingOpticalCorrection
                                    withWrap
                                >
                                    <Link
                                        href="https://www.mapbox.com/about/maps/"
                                        external
                                        title="Mapbox"
                                        aria-label="Mapbox"
                                        role="listitem"
                                        withLinkIcon
                                        spacing="xs"
                                    >
                                        © Mapbox
                                    </Link>
                                    <Link
                                        href="https://www.openstreetmap.org/about/"
                                        external
                                        title="OpenStreetMap"
                                        aria-label="OpenStreetMap"
                                        role="listitem"
                                        withLinkIcon
                                        spacing="xs"
                                    >
                                        © OpenStreetMap
                                    </Link>
                                    <Link
                                        className="mapbox-improve-map"
                                        href={`https://apps.mapbox.com/feedback/?owner=go-ifrc&amp;id=ckrfe16ru4c8718phmckdfjh0&amp;access_token=${mbToken}`}
                                        external
                                        title="Map feedback"
                                        aria-label="Map feedback"
                                        role="listitem"
                                        withLinkIcon
                                        spacing="xs"
                                    >
                                        Improve this map
                                    </Link>
                                </ListView>
                            </ListView>
                        )}
                    />
                    {withPresentationMode && !printMode && !presentationMode && (
                        <Button
                            className={styles.presentationModeButton}
                            name={undefined}
                            before={<ArtboardLineIcon />}
                            onClick={enterPresentationMode}
                        >
                            Presentation Mode
                        </Button>
                    )}
                    {!printMode && !presentationMode && !withoutDownloadButton && (
                        <RawButton
                            className={styles.downloadButton}
                            name={undefined}
                            onClick={enterPrintMode}
                            title="Download"
                        >
                            <DownloadTwoLineIcon />
                        </RawButton>
                    )}
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
                {footer && (
                    <ListView
                        withPadding
                        withWrap
                        withDarkBackground
                        withSpaceBetweenContents
                    >
                        {footer}
                    </ListView>
                )}
                {presentationMode && presentationModeAdditionalAfterContent}
            </ListView>
        </Container>
    );
}

export default GoMapContainer;
