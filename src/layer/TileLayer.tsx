import * as React from 'react';

import OlTileLayer, { Options } from 'ol/layer/Tile';

import { useLayer } from '../../hooks';

type Props = Options & {
    id: string;
};

const TileLayer: React.FunctionComponent<Props> = ({ id, visible, ...props }) => {
    const layerRef = React.useRef<OlTileLayer>(null);
    useLayer(
        () => {
            layerRef.current = new OlTileLayer({
                visible,
                ...props
            });
            layerRef.current.set('id', id);
            return layerRef.current;
        },
        props,
        [id]
    );

    const { preload, useInterimTilesOnError } = props;
    React.useEffect(() => {
        if (preload !== undefined) {
            layerRef.current.setPreload(preload);
        }
        if (useInterimTilesOnError !== undefined) {
            layerRef.current.setUseInterimTilesOnError(useInterimTilesOnError);
        }
    }, [preload, useInterimTilesOnError]);

    return null;
};

TileLayer.defaultProps = {
    preload: 2
};
TileLayer.displayName = 'TileLayer';

export default TileLayer;
