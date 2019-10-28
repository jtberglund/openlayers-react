import './Button.scss';

import * as React from 'react';
import classnames from 'classnames';

import { Theme, Themed } from '@cgsweb/theme';

import { pipe } from 'lodash/fp';
import { stopEvent } from '../../../utils';

export type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Button: React.FunctionComponent<ButtonProps> = React.forwardRef(({ className, onClick, ...props }, ref) => {
    // tslint:disable-next-line:react-hooks-nesting
    const handleClick = React.useCallback(
        pipe(
            stopEvent,
            onClick
        ),
        [onClick]
    );
    return (
        <Themed style={getStyle}>
            {({ classNames }) => (
                <button
                    {...props}
                    ref={ref}
                    onClick={handleClick}
                    className={classnames('ol-generic-button', className, classNames.button)}
                />
            )}
        </Themed>
    );
});

Button.defaultProps = {
    className: '',
    onClick: () => {}
};
Button.displayName = 'Button';

export const getStyle = ({ colors }: Theme) => ({
    button: {
        borderColor: colors.border,
        backgroundColor: colors.tier3,
        color: colors.font,
        ':hover': {
            color: colors.fontHover,
            backgroundColor: colors.tier2
        }
    }
});

export default Button;
