import * as React from 'react';

import { InteractionOptions, useInteraction } from '../../hooks';
import OlInteraction, { InteractionOptions as OlInteractionOptions } from 'ol/interaction/Interaction';

export type InteractionProps = Partial<OlInteractionOptions> & InteractionOptions;

const Interaction: React.FunctionComponent<InteractionProps> = ({ children, active, ...options }) => {
    useInteraction(
        () =>
            new OlInteraction({
                handleEvent: () => true,
                ...options
            }),
        { active }
    );
    return React.Children.only(children) as any;
};

Interaction.defaultProps = {};
Interaction.displayName = 'Interaction';

export default Interaction;
