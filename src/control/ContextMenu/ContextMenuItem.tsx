import * as React from 'react';
import classnames from 'classnames';

import { Theme, useStyles } from '@cgsweb/theme';
import { useMap, useStopEvent } from '../../../hooks';

import { ContextMenuContext } from './ContextMenu';
import { Stream } from '@cgsweb/events';
import { isKey } from '../../../utils';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    preventCloseOnClick?: boolean;
}

const ContextMenuItem: React.FunctionComponent<Props> = ({ preventCloseOnClick, className, onClick = () => {}, children, ...props }) => {
    const classNames = useStyles(getStyle);
    const map = useMap();
    const { close } = React.useContext(ContextMenuContext);
    const ref = React.useRef<HTMLDivElement>(null);

    const handleClick = React.useCallback(
        e => {
            onClick(e);
            if (!preventCloseOnClick) {
                close();
            }
        },
        [onClick, close]
    );

    // Close on 'ESC' press
    useKeyboardEvent(
        {
            key: 'Escape',
            callback: close,
            target: map.getTargetElement()
        },
        [close, map.getTargetElement()]
    );

    // Prevent a map click from occuring when the user clicks this context menu item
    useStopEvent(
        {
            type: 'pointerdown',
            condition: e => e.target === ref.current
        },
        [ref]
    );

    return (
        <div className={classnames(classNames.item, className)} onClick={handleClick} ref={ref} {...props}>
            {children}
        </div>
    );
};

// TODO: TEMP - use this hook from @cgsweb/util/react when available
function useKeyboardEvent(
    { callback, key, target }: { callback: () => void; key: string; target?: HTMLElement },
    deps: React.DependencyList = []
) {
    React.useEffect(() => {
        if (target) {
            const sub = Stream.fromDomEvent('keydown', target)
                .filter(isKey(key))
                .subscribe(callback);
            return () => sub.unsubscribe();
        }
        return undefined;
    }, [callback, target, ...deps]);
}

const getStyle = ({ colors }: Theme) => ({
    item: {
        cursor: 'pointer',
        padding: '4px 16px',
        fontSize: '14px',
        ':hover': {
            backgroundColor: colors.tier3
        }
    }
});

ContextMenuItem.defaultProps = {};
ContextMenuItem.displayName = 'ContextMenuItem';

export default ContextMenuItem;
