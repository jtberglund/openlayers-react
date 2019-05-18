import * as React from 'react';

import { MapOptions } from 'ol/PluggableMap';

interface Props extends MapOptions {}

const Map: React.FC<Props> = ({}) => {
    return <div>Map</div>;
};

Map.displayName = 'Map';

export default Map;
