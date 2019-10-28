import './Zoom.scss';

import * as React from 'react';
import classnames from 'classnames';

import Button from '../../generic/Button';
import ButtonGroup from '../../generic/ButtonGroup/ButtonGroup';
import { Coordinate } from 'ol/coordinate';
import { MapContext } from '../../Map/Map';
import OlControl from 'ol/control/Control';
import { Omit } from '@cgsweb/util';
import { Options } from 'ol/control/Zoom';
import View from 'ol/View';
import { easeOut } from 'ol/easing';
import { useControl } from '../../../hooks';

type Props = Omit<Options, 'target'>;

/**
 * Buttons for zooming in and out on the map
 *
 * Default placement is upper-left corner. Specify a `className` to override the placement
 */
const ZoomControl: React.FunctionComponent<Props> = ({
    duration,
    delta,
    zoomInLabel,
    zoomOutLabel,
    zoomInTipLabel,
    zoomOutTipLabel,
    className
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const { view } = React.useContext(MapContext);
    const zoomIn = React.useCallback(() => zoomByDelta(view, delta, duration), [delta, duration, view]);
    const zoomOut = React.useCallback(() => zoomByDelta(view, -delta, duration), [delta, duration, view]);

    useControl(() => new OlControl({ element: ref.current }));

    return (
        <ButtonGroup className={classnames('ol-zoom-control', className)} ref={ref}>
            <Button title={zoomInTipLabel} onClick={zoomIn}>
                <span className="ol-zoom-control__zoom-text">{zoomInLabel}</span>
            </Button>
            <Button title={zoomOutTipLabel} onClick={zoomOut}>
                <span className="ol-zoom-control__zoom-text">{zoomOutLabel}</span>
            </Button>
        </ButtonGroup>
    );
};

// Adapted from https://github.com/openlayers/openlayers/blob/master/src/ol/interaction/Interaction.js
export function zoomByDelta(view: View, delta: number, duration: number = 250, anchor?: Coordinate) {
    if (!view) {
        console.warn('Zoom control warning: Was not able to get view from map');
        return;
    }

    const currentZoom = view.getZoom();
    if (currentZoom === undefined) {
        return;
    }

    const newZoom = view.getConstrainedZoom(currentZoom + delta);
    const newResolution = view.getResolutionForZoom(newZoom);

    if (view.getAnimating()) {
        view.cancelAnimations();
    }
    view.animate({
        resolution: newResolution,
        anchor,
        duration,
        easing: easeOut
    });
}

ZoomControl.defaultProps = {
    zoomInLabel: '+',
    zoomOutLabel: '-',
    zoomInTipLabel: 'Zoom In',
    zoomOutTipLabel: 'Zoom Out',
    duration: 250,
    delta: 1
};
ZoomControl.displayName = 'ZoomControl';

export default ZoomControl;
