import './ButtonGroup.scss';

import * as React from 'react';
import classnames from 'classnames';

export type ButtonGroupProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const ButtonGroup: React.FunctionComponent<ButtonGroupProps> = React.forwardRef(({ className, ...props }, ref) => {
    return <div className={classnames('ol-button-control-group', className)} ref={ref} {...props} />;
});

ButtonGroup.defaultProps = {
    className: ''
};
ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
