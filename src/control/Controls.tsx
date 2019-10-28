import * as React from 'react';

import { ControlContext } from '../../context';
import { useMap } from '../../hooks';

interface Props {}

const Controls: React.FunctionComponent<Props> = ({ children }) => {
    const map = useMap();
    const addControl = React.useCallback(layer => map.addControl(layer), []);
    const removeControl = React.useCallback(layer => map.removeControl(layer), [map]);

    return <ControlContext.Provider value={{ addControl, removeControl }}>{children}</ControlContext.Provider>;
};

Controls.defaultProps = {};
Controls.displayName = 'Controls';

export default Controls;
