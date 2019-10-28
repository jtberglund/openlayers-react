import './Popup.scss';

import * as React from 'react';

import Overlay, { OverlayProps } from '../Overlay';
import { isKey, stopEvent } from '../utils';
import { useMap, useStopEvent } from '../hooks';

import classnames from 'classnames';

interface Props extends OverlayProps {
    closable?: boolean;
    onClose?: () => void;
    closeOnEscape?: boolean;
}

const Popup: React.FunctionComponent<Props> = ({
    containerProps,
    className,
    closable,
    onClose = () => {},
    closeOnEscape,
    children,
    ...props
}) => {
    const map = useMap();
    const closeRef = React.useRef<HTMLButtonElement>(null);

    const [show, setShow] = React.useState(props.show === undefined ? true : props.show);
    const handleClose = React.useCallback(
        e => {
            stopEvent(e);
            if (props.show !== undefined) {
                onClose();
            } else {
                setShow(false);
            }
        },
        [show, onClose, closable]
    );

    // If the user clicks the close button, we need to stop propagation of the event
    // on the overlay container, otherwise OpenLayers will propagate the event and
    // it could be handled multiple times
    useStopEvent(
        {
            type: 'pointerdown',
            condition: e => closable && show && e.target === closeRef.current
        },
        [show, closable, closeRef]
    );

    // Sync state.show with props.show (allows for use of Popup as either controlled or uncontrolled component)
    React.useEffect(() => {
        if (props.show !== undefined) {
            setShow(props.show);
        }
    }, [props.show]);

    // Close on 'ESC' press
    React.useEffect(() => {
        if (closable && map.getTargetElement()) {
            const sub = Stream.fromDomEvent('keydown', map.getTargetElement())
                .filter(isKey('Escape'))
                .subscribe(handleClose);
            return () => sub.unsubscribe();
        }
        return undefined;
    }, [closable, closeOnEscape, handleClose, map.getTargetElement()]);

    const popupContainerProps = React.useMemo<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>(
        () => ({
            style: {
                zIndex: 1
            },
            ...containerProps
        }),
        [containerProps]
    );

    return (
        <Overlay {...props} containerProps={popupContainerProps} show={show} className={classnames('ol-popup', className)}>
            {closable && (
                <button title="Close" className="ol-popup__closer" onClick={handleClose} ref={closeRef}>
                    ×
                </button>
            )}
            {children}
        </Overlay>
    );
};

Popup.defaultProps = {};
Popup.displayName = 'Popup';

export default Popup;
