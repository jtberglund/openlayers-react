import 'ol/ol.css';

import * as React from 'react';

import { EventsKey } from 'ol/events';
import { MapOptions } from 'ol/PluggableMap';
import OlMap from 'ol/Map';
import View from 'ol/View';
import { useMap } from '../hooks';

type OlMapOptions = Omit<MapOptions, 'controls' | 'overlays' | 'interactions' | 'target' | 'keyboardEventTarget'>;
export type MapProps = OlMapOptions & {
    className?: string;
};

enum MapActions {
    SET_VIEW = 'SET_VIEW',
    SET_TARGET = 'SET_TARGET',
    SET_LISTENERS = 'SET_LISTENERS'
}

interface MapState {
    view: View;
    target: HTMLElement | null;
    listeners: { [key: string]: ((e: any) => boolean)[] };
}

interface MapAction<T> {
    type: MapActions;
    payload: T;
}

const DEFAULT_VIEW = new View({
    center: [0, 0],
    zoom: 4,
    projection: 'EPSG:4326'
});

function initStateFromProps({ view = DEFAULT_VIEW }: MapProps) {
    return { view, target: null, listeners: {} };
}

function reducer(state: MapState, { type, payload }: MapAction<Partial<MapState>>): MapState {
    switch (type) {
        case MapActions.SET_VIEW: {
            return { ...state, view: payload.view };
        }
        case MapActions.SET_TARGET: {
            return { ...state, target: payload.target };
        }
        case MapActions.SET_LISTENERS: {
            return { ...state, listeners: payload.listeners };
        }
        default:
            throw new Error();
    }
}

const Map: React.FunctionComponent<MapProps> = ({ className, children, ...props }) => {
    const map = useMap();
    const mapContainer = React.useRef<HTMLDivElement | null>(null);

    const [state, dispatch] = React.useReducer(reducer, initStateFromProps(props));
    const { view, target, listeners } = state;

    const setView = React.useCallback(newView => dispatch({ type: MapActions.SET_VIEW, payload: { view: newView } }), []);
    const handleMapClick = React.useCallback(() => focusElement(map.getTargetElement()), [map]);

    const pushEventListener = React.useCallback(
        (type: string, callback) => {
            const listenersForType = listeners[type] || [];
            const newListeners = {
                ...listeners,
                [type]: listenersForType.concat(callback)
            };
            dispatch({ type: MapActions.SET_LISTENERS, payload: { listeners: newListeners } });
        },
        [listeners]
    );
    const removeEventListener = React.useCallback(
        (type: string, callback) => {
            const listenersForType = listeners[type] || [];
            const newListeners = {
                ...listeners,
                [type]: listenersForType.filter(l => l !== callback)
            };
            dispatch({ type: MapActions.SET_LISTENERS, payload: { listeners: newListeners } });
            return newListeners[type].length !== listenersForType.length;
        },
        [listeners]
    );

    useMapTarget({
        map,
        target: mapContainer,
        onTargetChange: el => dispatch({ type: MapActions.SET_TARGET, payload: { target: el } })
    });

    useView(map, view);

    return (
        <MapContext.Provider value={{ target, view, setView, pushEventListener, removeEventListener }}>
            {/* Set `tabIndex` and manually focus the map each time the user interacts with it
                so that we make sure that keyboard events are captured properly */}
            <div id="map" className={className} style={{ outline: 'none' }} tabIndex={-1} onClick={handleMapClick} ref={mapContainer}>
                {children}
            </div>
        </MapContext.Provider>
    );
};

export function useMapEvent<T>(type: string, callback: (e: T) => boolean, deps: React.DependencyList = []) {
    const { pushEventListener, removeEventListener } = React.useContext(MapContext);

    React.useEffect(() => {
        pushEventListener(type, callback);
        return () => {
            removeEventListener(type, callback);
        };
    }, [pushEventListener, removeEventListener, ...deps]);
}

function useView(map: OlMap, view: View) {
    React.useEffect(() => {
        // console.log('view effect');
        map.setView(view);
        const sub = view.on('propertychange', ({ key, target: newView }) => {
            // console.log('view:change', { key, view: newView });
        }) as EventsKey;

        return () => view.un('change', sub.listener);
        // }, [view.getCenter(), view.getZoom()]);
    }, [view]);
}

interface UseMapTargetOptions {
    map: OlMap;
    target: React.MutableRefObject<HTMLElement | null>;
    onTargetChange: (target?: HTMLElement) => void;
}

function useMapTarget({ map, target, onTargetChange }: UseMapTargetOptions) {
    React.useEffect(() => {
        const sub = map.on('change:target', e => onTargetChange(e.target.getTargetElement()));
        map.setTarget(target.current as any);
        return () => {
            if (target.current && (map.renderer_ as any).element_) {
                (map.renderer_ as any).element_.remove();
            }
            map.un('change:target', (sub as any).listener);
            map.setTarget(undefined);
        };
    }, [map, target.current]);
}

const focusElement = (element?: HTMLElement) => {
    if (element && element.focus) {
        element.focus();
    }
};

export interface MapContextParams {
    target: HTMLElement | null;
    view: View;
    setView: (view: View) => void;

    pushEventListener: (type: string, callback: (e: any) => boolean) => void;
    removeEventListener: (type: string, callback: ((e: any) => boolean) | number) => boolean;
}

export const MapContext = React.createContext<MapContextParams>(undefined as any);

Map.defaultProps = {};
Map.displayName = 'Map';

export default Map;
