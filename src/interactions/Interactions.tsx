import * as React from 'react';

import { InteractionContext } from '../../context';
import { useMap } from '../../hooks';

interface Props {}

const Interactions: React.FunctionComponent<Props> = ({ children }) => {
    const map = useMap();
    const addInteraction = React.useCallback(layer => map.addInteraction(layer), []);
    const removeInteraction = React.useCallback(layer => map.removeInteraction(layer), [map]);

    return <InteractionContext.Provider value={{ addInteraction, removeInteraction }}>{children}</InteractionContext.Provider>;
};

Interactions.defaultProps = {};
Interactions.displayName = 'Interactions';

export default Interactions;
