import * as React from 'react';

import OlMousePosition, { Options } from 'ol/control/MousePosition';
import { Theme, useStyles } from '@cgsweb/theme';

import { useControl } from '../../../hooks';

type Props = Options;

/**
 * Show the lat/lon of the cursor on the map.
 *
 * The format of the coordinates defaults to the projection of the Map's view.
 * Pass a `projection` or `coordinateFormat` function to render in a different format
 *
 * Default placement is the lower-right corner.
 * Specify a `className` to override the position.
 */
const MousePosition: React.FunctionComponent<Props> = props => {
    const classNames = useStyles(getStyle);
    useControl(
        () =>
            new OlMousePosition({
                undefinedHTML: '',
                className: classNames.mousePos,
                ...props
            })
    );
    return null;
};

const getStyle = ({ colors }: Theme) => ({
    mousePos: {
        bottom: '0',
        right: '0',
        position: 'absolute' as 'absolute',
        borderTopLeftRadius: '2px',
        padding: '0 4px',
        color: colors.font,
        backgroundColor: colors.tier1
    }
});

MousePosition.defaultProps = {};
MousePosition.displayName = 'MousePosition';

export default MousePosition;
