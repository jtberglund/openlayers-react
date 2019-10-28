import * as React from 'react';
import classnames from 'classnames';

import { Theme, useStyles } from '@cgsweb/theme';
import { useMap, useObservable } from '../../../hooks';

import { AtPixelOptions } from 'ol/PluggableMap';
import ContextMenuItem from './ContextMenuItem';
import { Coordinate } from 'ol/coordinate';
import { FeatureLike } from 'ol/Feature';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { MapContext } from '../../Map/Map';
import OlOverlay from 'ol/Overlay';
import Overlay from '../../Overlay';

interface Props {
    featureSelectionOptions?: AtPixelOptions;
}

const ContextMenu: React.FunctionComponent<Props> = ({ featureSelectionOptions, children }) => {
    const map = useMap();
    const { target: mapTarget } = React.useContext(MapContext);
    const classNames = useStyles(getStyle);

    const [show, setShow] = React.useState(false);
    const [position, setPosition] = React.useState<Coordinate>(undefined);
    const [selectedFeatures, setSelectedFeatures] = React.useState<FeatureLike[]>([]);

    // Open the context menu on right-click
    React.useEffect(() => {
        if (mapTarget) {
            const listener = e => {
                if (e.target === map.getOverlayContainerStopEvent()) {
                    e.preventDefault();

                    const pixel = [e.offsetX, e.offsetY];
                    const coord = map.getCoordinateFromPixel(pixel);
                    const features = map.getFeaturesAtPixel(pixel, featureSelectionOptions) || [];
                    setPosition(coord);
                    setShow(true);
                    setSelectedFeatures(features);
                }
            };
            mapTarget.addEventListener('contextmenu', listener);
            return () => mapTarget.removeEventListener('contextmenu', listener);
        }
        return undefined;
    }, [mapTarget, featureSelectionOptions]);

    const close = React.useCallback(() => {
        setShow(false);
        setSelectedFeatures([]);
    }, []);

    useObservable<MapBrowserEvent>(map, 'click', close);

    // Set a z-index so the context menu appears above other controls/overlays
    const onMount = React.useCallback((overlay: OlOverlay) => {
        const contextMenu = overlay.getElement();
        if (contextMenu) {
            contextMenu.parentElement.style.zIndex = '2';
        }
    }, []);

    return (
        <ContextMenuContext.Provider value={{ isOpen: show, close, selectedFeatures }}>
            {/* <Interaction handleEvent={handleEvent}> */}
            <Overlay show={show} className={classnames('ol-context-menu', classNames.contextMenu)} position={position} onMount={onMount}>
                {children}
                <ContextMenuItem>Test Item</ContextMenuItem>
            </Overlay>
            {/* </Interaction> */}
        </ContextMenuContext.Provider>
    );
};

export interface ContextMenuState {
    isOpen: boolean;
    close: () => void;
    selectedFeatures: FeatureLike[];
}

export const ContextMenuContext = React.createContext<ContextMenuState>(undefined);

const getStyle = ({ colors }: Theme) => ({
    contextMenu: {
        minWidth: '140px',
        padding: '8px 0',
        borderRadius: '2px',
        backgroundColor: colors.tier2
    }
});

ContextMenu.defaultProps = {};
ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;
