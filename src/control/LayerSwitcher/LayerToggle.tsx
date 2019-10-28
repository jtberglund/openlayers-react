import * as React from 'react';

import { RadioInput } from '@cgsweb/core';

interface Props {
    title: string;
    isVisible: boolean;
    onChange: (isVisible: boolean) => void;
}

const LayerToggle: React.FunctionComponent<Props> = ({ title, isVisible, onChange: setIsVisible }) => {
    return <RadioInput hintText={title} label={title} onChange={() => setIsVisible(!isVisible)} checked={isVisible} />;
};

LayerToggle.defaultProps = {};
LayerToggle.displayName = 'LayerToggle';

export default LayerToggle;
