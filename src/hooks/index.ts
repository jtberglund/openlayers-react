import * as React from 'react';

import { ControlContext, InteractionContext, LayersContext, OpenLayersContext } from '../context';
import Layer, { Options } from 'ol/layer/Layer';

import Control from 'ol/control/Control';
import Event from 'ol/events/Event';
import Interaction from 'ol/interaction/Interaction';
import Observable from 'ol/Observable';
import Source from 'ol/source/Source';
import { stopEvent } from '../utils';

export const useMap = () => {
    const context = React.useContext(OpenLayersContext);
    if (!context) {
        throw new Error('useMap must be used within an OpenLayers.Provider');
    }

    return context.map;
};

export type LayerOptions<T extends Source> = Options & {
    source?: T;
};

export const useLayer = <T extends Source>(
    layerFactory: () => Layer<T>,
    { visible, opacity, minResolution, maxResolution, extent, source, zIndex }: LayerOptions<T> = {},
    deps: React.DependencyList = []
) => {
    const layer = React.useRef<Layer<T>>(null);
    const { addLayer, removeLayer } = React.useContext(LayersContext);
    React.useEffect(() => {
        layer.current = layerFactory();
        addLayer(layer.current);
        return () => removeLayer(layer.current);
    }, deps);

    React.useEffect(() => {
        if (visible !== undefined) {
            layer.current.setVisible(visible);
        }
        if (opacity !== undefined) {
            layer.current.setOpacity(opacity);
        }
        if (minResolution !== undefined) {
            layer.current.setMinResolution(minResolution);
        }
        if (maxResolution !== undefined) {
            layer.current.setMaxResolution(maxResolution);
        }
        if (extent !== undefined) {
            layer.current.setExtent(extent);
        }
        if (zIndex !== undefined) {
            layer.current.setZIndex(zIndex);
        }
    }, [visible, opacity, minResolution, maxResolution, extent, zIndex]);

    // Check for `source` changes in a separate hook, since React can't compare sources (they will always show as different objects)
    React.useEffect(() => {
        if (source !== undefined && !compareSources(layer.current.getSource(), source)) {
            layer.current.setSource(source);
        }
    });
};

/**
 * Returns `true` if two sources are equal
 *
 * **TODO** Not sure if this will work on all Layer source types
 */
function compareSources(sourceA: Source, sourceB: Source) {
    const idA = (sourceA as any).key_;
    const idB = (sourceB as any).key_;
    return idA === idB;
}

export const useControl = (controlFactory: () => Control, deps: React.DependencyList = []) => {
    const { addControl, removeControl } = React.useContext(ControlContext);
    React.useEffect(() => {
        const control = controlFactory();
        addControl(control);
        return () => removeControl(control);
    }, deps);
};

export interface InteractionOptions {
    active?: boolean;
}

export const useInteraction = (
    interactionFactory: () => Interaction,
    { active }: InteractionOptions = {},
    deps: React.DependencyList = []
) => {
    const { addInteraction, removeInteraction } = React.useContext(InteractionContext);

    const control = React.useRef<Interaction>(null);

    React.useEffect(() => {
        control.current = interactionFactory();
        addInteraction(control.current);
        return () => removeInteraction(control.current);
    }, deps);

    React.useEffect(() => {
        if (active !== undefined) {
            control.current.setActive(active);
        }
    }, [active]);
};

export const useObservable = <E extends Event>(
    target: Observable,
    type: string | string[],
    callback: (e: E) => void,
    deps?: React.DependencyList
) => {
    const memoedCallback = React.useCallback(callback, deps);

    React.useEffect(() => {
        target.on(type, memoedCallback);
        return () => target.un(type, memoedCallback);
    }, [target, type, memoedCallback]);
};

/**
 * Use to stop propagation of events in order to prevent OpenLayers from handling events.
 *
 * e.g. If you have a control component that need to stop propagation of an event when the control is clicked:
 *
 * ```
 * const controlRef = React.useRef(null);
 *
 * // Stop event propagation when control is clicked
 * useStopEvent({
 *     type: 'pointerdown',
 *     condition: e => e.target === controlRef.current
 * }, [controlRef]);
 *
 * return (
 *     <div ref={controlRef} {...} />
 * );
 * ```
 */
export const useStopEvent = <T = Event>(
    { type, condition }: { type: string; condition: (e: T) => boolean },
    deps: React.DependencyList = []
) => {
    const map = useMap();

    React.useEffect(() => {
        const handleEvent = e => {
            if (condition(e)) {
                stopEvent(e);
            }
        };

        const overlayStopEvent = map.getOverlayContainerStopEvent();
        if (overlayStopEvent) {
            overlayStopEvent.addEventListener(type, handleEvent);
        }

        return () => {
            if (overlayStopEvent) {
                overlayStopEvent.removeEventListener(type, handleEvent);
            }
        };
    }, [map, ...deps]);
};
