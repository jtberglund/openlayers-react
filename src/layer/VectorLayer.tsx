import * as React from 'react';

import OlVectorLayer, { Options } from 'ol/layer/Vector';

import { useLayer } from '../../hooks';

type Props = Options;

const VectorLayer: React.FunctionComponent<Props> = ({ visible, ...props }) => {
    const layer = React.useRef<OlVectorLayer>(null);
    useLayer(
        () => {
            layer.current = new OlVectorLayer({
                visible,
                ...props
            });
            return layer.current;
        },
        props,
        [props.renderBuffer, props.updateWhileAnimating, props.updateWhileInteracting, props.declutter]
    );

    // If the following props change, we don't have to re-create the layer, we can manually change them
    const { renderOrder, style } = props;
    React.useEffect(() => {
        if (renderOrder !== undefined) {
            layer.current.setRenderOrder(renderOrder);
        }
        if (style !== undefined) {
            layer.current.setStyle(style);
        }
    }, [renderOrder, style]);
    return null;
};

VectorLayer.defaultProps = {};
VectorLayer.displayName = 'VectorLayer';

export default VectorLayer;
