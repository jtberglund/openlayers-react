import * as React from 'react';

import OlControl, { Options } from 'ol/control/Control';

import { useControl } from '../../hooks';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    controlOptions?: Options;
};

const Control: React.FunctionComponent<Props> = ({ controlOptions, ...props }) => {
    const container = React.useRef(null);
    useControl(() => new OlControl({ element: container.current, ...controlOptions }));
    return <div {...props} ref={container} />;
};

Control.defaultProps = {};
Control.displayName = 'Control';

export default Control;
