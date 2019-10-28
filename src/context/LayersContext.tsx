import * as React from 'react';

import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import Source from 'ol/source/Source';

export interface LayersContextParams {
    addLayer: <T extends Source>(layer: Layer<T>) => void;
    removeLayer: <T extends Source>(layer: Layer<T>) => BaseLayer;
}

const LayersContext = React.createContext<LayersContextParams>(undefined as any);

export default LayersContext;
