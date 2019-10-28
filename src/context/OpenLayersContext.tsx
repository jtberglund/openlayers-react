import * as React from 'react';

import Map from 'ol/Map';

export interface OpenLayersContextParams {
    map: Map;
}

const OpenLayersContext = React.createContext<OpenLayersContextParams>(undefined as any);

// type Props = React.ProviderProps<Omit<OpenLayersContextParams, 'map'>>;

// const Provider: React.FunctionComponent<Props> = ({ value, children }) => {
//     const map = new Map({});
//     const providedValue: OpenLayersContext = {
//         ...value,
//         map
//     };
//     return <ContextProvider value={providedValue}>{children}</ContextProvider>;
// };

// const OpenLayersContext = { Consumer, Provider } as React.Context<OpenLayersState>;

export default OpenLayersContext;
