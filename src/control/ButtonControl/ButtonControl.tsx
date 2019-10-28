import './ButtonControl.scss';

import * as React from 'react';
import classnames from 'classnames';

import Button, { ButtonProps } from '../../generic/Button';

import Control from '../Control';

export type ButtonControlProps = ButtonProps;

const ButtonControl: React.FunctionComponent<ButtonControlProps> = ({ className, ...props }) => {
    return (
        <Control className={classnames('ol-button-control', className)}>
            <Button {...props} />
        </Control>
    );
};

ButtonControl.defaultProps = {};
ButtonControl.displayName = 'ButtonControl';

export default ButtonControl;
