import * as React from 'react';

import OlOverlay, { Options } from 'ol/Overlay';

import { Omit } from '@cgsweb/util';
import { useMap } from '../hooks';

export type OverlayProps = Omit<Options, 'element'> & {
    show?: boolean;
    containerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    onMount?: (overlay: OlOverlay) => void;
};

const Overlay: React.FunctionComponent<OverlayProps> = ({ containerProps, children, className, show, onMount = () => {}, ...props }) => {
    const map = useMap();
    const container = React.useRef<HTMLDivElement>(null);
    const overlay = React.useRef<OlOverlay>(null);

    React.useEffect(() => {
        overlay.current = new OlOverlay({ element: container.current, ...props });
        return () => map.removeOverlay(overlay.current);
    }, [map, props.autoPan, props.autoPanAnimation, props.autoPanMargin, props.id, props.insertFirst, props.stopEvent]);

    // Toggle overlay when `show` changes
    React.useEffect(() => {
        if (show) {
            map.addOverlay(overlay.current);
            onMount(overlay.current);
        } else {
            map.removeOverlay(overlay.current);
        }
    }, [show]);

    const { offset, position, positioning } = props;
    React.useEffect(() => {
        if (offset !== undefined) {
            overlay.current.setOffset(offset);
        }
        if (position !== undefined) {
            overlay.current.setPosition(position);
        }
        if (positioning !== undefined) {
            overlay.current.setPositioning(positioning);
        }
    }, [offset, position, positioning]);

    // Since OpenLayers will take remove the DOM element that we specifiy as the overlay container and
    // move it to it's own overlay div, we need to wrap the popup content in a div so that React
    // doesn't lose track of the element that's mounted

    // The outer div will be render in the React tree wherever this component is rendered
    // The inner div will be moved into the OpenLayers overlay div, so we put the `className` and `ref` on that div
    return (
        <div>
            <div className={className} ref={container} {...containerProps}>
                {children}
            </div>
        </div>
    );
};

Overlay.defaultProps = {
    show: true
};
Overlay.displayName = 'Overlay';

export default Overlay;
