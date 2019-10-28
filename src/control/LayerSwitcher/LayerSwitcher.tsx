import './LayerSwitcher.scss';

import * as React from 'react';

import BaseLayer from 'ol/layer/Base';
import Collection from 'ol/Collection';
import Control from '../Control';
import { EventsKey } from 'ol/events';
import LayerIcon from '../../generic/icons/LayerIcon/LayerIcon';
import LayerToggle from './LayerToggle';
import { Themed } from '@cgsweb/theme';
import classnames from 'classnames';
import { getStyle } from '../../generic/Button';
import { useMap } from '../../../hooks';

const getId = (layer: BaseLayer): string => (layer ? layer.get('id') : undefined);

const getLayersWithIdProperty = (layers: Collection<BaseLayer>) => layers.getArray().filter(getId);

/**
 * Hook that:
 * 1. Keeps track of the currently visible layer and returns an updater function
 * 2. Keeps the 'visible' state of all layers in sync (only 1 layer can be visible at a time)
 *
 * **NOTE**: Requires all layers to have an 'id' property set in order to distinguish between layers
 *
 * Usage:
 * ```js
 * const [visibleLayerId, setVisibleLayerId] = useSelectLayer(map.getLayers());
 * ```
 * @param layers
 */
export const useSelectedLayer = (layers: Collection<BaseLayer>): [string, React.Dispatch<React.SetStateAction<string>>] => {
    const layerArray = getLayersWithIdProperty(layers); // layers MUST have an 'id' property

    // We can only have 1 visible layer at a time, so grab use the first visible layer in the list
    const [visibleLayerId, setVisibleLayerId] = React.useState(() => {
        const initialVisibleLayer = layerArray.find(layer => layer.getVisible());
        return getId(initialVisibleLayer);
    });

    // Whenever the visible layer changes, hide all other layers
    React.useEffect(() => {
        layerArray.forEach(layer => layer.setVisible(getId(layer) === visibleLayerId));
    }, [visibleLayerId]);

    // Since OpenLayers mutates the layers collection on the map, we need to listen for 'propertychange' events
    // to know when to update the visible layer.
    // `useLayoutEffect` must be used instead of `useEffect` so that we don't miss any events
    React.useLayoutEffect(() => {
        const sub = layers.on('propertychange', e => {
            // tslint:disable:variable-name
            const _layers = e.target as Collection<BaseLayer>;
            const _layersArray = getLayersWithIdProperty(_layers);
            const newVisibleLayer = getId(_layersArray.find(layer => layer.getVisible()));

            // If the layer changed, set the new visible layer ID
            // If not, we still need to update the 'visible' status of all layers in case a new layer has been added
            if (visibleLayerId !== newVisibleLayer) {
                setVisibleLayerId(newVisibleLayer);
            } else {
                _layersArray.forEach(layer => layer.setVisible(getId(layer) === visibleLayerId));
            }
            // tslint:enable:variable-name
        }) as EventsKey;

        return () => layers.un('propertychange', sub.listener);
    }, [visibleLayerId]);

    return [visibleLayerId, setVisibleLayerId];
};

interface LayerSwitcherProps {
    // selectedLayerId: string;
    // onLayerSelect: (layerId: string) => void;
    className?: string;
}

/**
 * OpenLayers Control to allow the user to switch betwen base map layers.
 *
 * Default placement is on the upper-right of the map.
 * Specify a `className` with the proper styles to override that placement.
 *
 * Must be used inside a `<Controls>` component:
 *
 * ```jsx
 * <Map {...}>
 *      <Controls>
 *          <LayerSwitcher />
 *      </Controls>
 * </Map>
 * ```
 */
const LayerSwitcher: React.FunctionComponent<LayerSwitcherProps> = ({ className }) => {
    const map = useMap();

    const layerCollection = map.getLayers();
    const layerArray = getLayersWithIdProperty(layerCollection);

    const [isOpen, setIsOpen] = React.useState(false);
    const [visibleLayer, setIsVisible] = useSelectedLayer(layerCollection);

    return (
        <Themed style={getStyle}>
            {({ classNames }) => (
                <Control
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    className={classnames('ol-layer-switcher', isOpen && 'ol-layer-switcher--open', className, classNames.button)}
                >
                    {isOpen ? (
                        <div className="ol-layer-switcher__toggle-container">
                            {layerArray.map(getId).map(layerId => (
                                <div key={layerId} className="ol-layer-switcher__toggle">
                                    <LayerToggle
                                        title={layerId}
                                        isVisible={visibleLayer === layerId}
                                        onChange={isVisible => isVisible && setIsVisible(layerId)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <LayerIcon />
                    )}
                </Control>
            )}
        </Themed>
    );
};

LayerSwitcher.defaultProps = {
    className: 'ol-layer-switcher--upper-left'
};
LayerSwitcher.displayName = 'LayerSwitcher';

export default LayerSwitcher;
