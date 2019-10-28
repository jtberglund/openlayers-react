import './Fullscreen.scss';

import * as React from 'react';

import { Omit, RenderableContent } from '@cgsweb/util';
import { useControl, useMap } from '../../../hooks';

import Button from '../../generic/Button';
import MaximizeIcon from '../../generic/icons/MaximizeIcon/MaximizeIcon';
import MinimizeIcon from '../../generic/icons/MinimizeIcon/MinimizeIcon';
import OlControl from 'ol/control/Control';
import { Options } from 'ol/control/FullScreen';
import classnames from 'classnames';
import { renderContent } from '@cgsweb/util/react';

export type FullscreenProps = Omit<Options, 'target' | 'label' | 'labelActive'> & {
    label?: RenderableContent;
    labelActive?: RenderableContent;
};

const IS_FULLSCREEN_SUPPORTED = isFullScreenSupported();
const FULLSCREEN_EVENTS = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];

const Fullscreen: React.FunctionComponent<FullscreenProps> = ({ className, label, labelActive, keys, source, tipLabel }) => {
    const map = useMap();
    const container = React.useRef(null);
    useControl(() => new OlControl({ element: container.current }));

    const [isFullscreen, setFullscreen] = React.useState(false);

    // Need to subscribe to document's fullscreen change events so we detect when
    // fullscreen is canceled by an 'Escape' press
    React.useEffect(() => {
        function handleFullscreenChange() {
            setFullscreen(isMapFullscreen());
            map.updateSize();
        }

        FULLSCREEN_EVENTS.forEach(event => document.addEventListener(event, handleFullscreenChange));

        return () => FULLSCREEN_EVENTS.forEach(event => document.removeEventListener(event, handleFullscreenChange));
    }, [map]);

    const toggleFullscreen = React.useCallback(() => {
        if (!IS_FULLSCREEN_SUPPORTED) {
            return;
        }

        const newIsFullscreen = !isFullscreen;
        const sourceElement = typeof source === 'string' ? document.getElementById(source) : source;
        const target = sourceElement || map.getTargetElement();
        if (newIsFullscreen) {
            if (keys) {
                requestFullScreenWithKeys(target);
            } else {
                requestFullScreen(target);
            }
        } else if (isMapFullscreen()) {
            exitFullScreen();
        }
        setFullscreen(newIsFullscreen);
    }, [isFullscreen, map, source]);

    // Exit fullscreen on unmount
    React.useEffect(() => {
        return () => exitFullScreen();
    }, []);

    const renderLabel = label ? renderContent(label) : <MaximizeIcon />;
    const renderActiveLabel = labelActive ? renderContent(labelActive) : <MinimizeIcon />;

    return (
        <Button ref={container} onClick={toggleFullscreen} className={classnames('ol-fullscreen', className)} title={tipLabel}>
            {isFullscreen ? renderActiveLabel : renderLabel}
        </Button>
    );
};

Fullscreen.defaultProps = {
    className: 'ol-fullscreen--upper-right',
    tipLabel: 'Toggle full-screen'
};
Fullscreen.displayName = 'Fullscreen';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Fullscreen util functions copied from https://github.com/openlayers/openlayers/blob/master/src/ol/control/FullScreen.js ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @return {boolean} Fullscreen is supported by the current platform.
 */
function isFullScreenSupported() {
    const body = document.body as any;
    const doc = document as any;
    return !!(
        body.webkitRequestFullscreen ||
        (body.mozRequestFullScreen && doc.mozFullScreenEnabled) ||
        (body.msRequestFullscreen && doc.msFullscreenEnabled) ||
        (body.requestFullscreen && doc.fullscreenEnabled)
    );
}

/**
 * @return {boolean} Element is currently in fullscreen.
 */
function isMapFullscreen() {
    const doc = document as any;
    return !!(doc.webkitIsFullScreen || doc.mozFullScreen || doc.msFullscreenElement || doc.fullscreenElement);
}

/**
 * Request to fullscreen an element.
 * @param {HTMLElement} element Element to request fullscreen
 */
function requestFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

/**
 * Request to fullscreen an element with keyboard input.
 * @param {HTMLElement} element Element to request fullscreen
 */
function requestFullScreenWithKeys(element) {
    if (element.mozRequestFullScreenWithKeys) {
        element.mozRequestFullScreenWithKeys();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else {
        requestFullScreen(element);
    }
}

/**
 * Exit fullscreen.
 */
function exitFullScreen() {
    if (!isMapFullscreen()) {
        return;
    }

    const doc = document as any;
    if (doc.exitFullscreen) {
        doc.exitFullscreen();
    } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
    }
}

export default Fullscreen;
