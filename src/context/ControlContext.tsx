import * as React from 'react';

import OlControl from 'ol/control/Control';

export interface ControlContextParams {
    addControl: (control: OlControl) => void;
    removeControl: (control: OlControl) => OlControl;
}

const ControlContext = React.createContext<ControlContextParams>(undefined as any);

export default ControlContext;
