import * as React from 'react';

import { LayersContext } from '../../context';
import { useMap } from '../../hooks';

interface Props {}

const Layers: React.FunctionComponent<Props> = ({ children }) => {
    const map = useMap();
    const addLayer = React.useCallback(layer => map.addLayer(layer), []);
    const removeLayer = React.useCallback(layer => map.removeLayer(layer), [map]);

    return (
        <LayersContext.Provider
            value={{
                addLayer,
                removeLayer
            }}
        >
            {children}
        </LayersContext.Provider>
    );
};

Layers.defaultProps = {};
Layers.displayName = 'Layers';

export default Layers;
