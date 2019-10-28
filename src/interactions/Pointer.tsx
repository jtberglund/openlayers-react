import * as React from 'react';

import PointerInteraction, { Options } from 'ol/interaction/Pointer';

import { useInteraction } from '../../hooks';
import { values } from 'lodash/fp';

type Props = Options & {
    active?: boolean;
};

const Pointer: React.FunctionComponent<Props> = ({ active, ...options }) => {
    useInteraction(() => new PointerInteraction(options), { active }, values(options));
    return null;
};

Pointer.defaultProps = {};
Pointer.displayName = 'Pointer';

export default Pointer;
