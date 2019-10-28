import * as React from 'react';

import OlInteraction from 'ol/interaction/Interaction';

export interface InteractionContextParams {
    addInteraction: (interaction: OlInteraction) => void;
    removeInteraction: (interaction: OlInteraction) => OlInteraction;
}

const InteractionContext = React.createContext<InteractionContextParams>(undefined as any);

export default InteractionContext;
