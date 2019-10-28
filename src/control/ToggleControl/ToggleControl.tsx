import * as React from 'react';
import classnames from 'classnames';

import ButtonControl, { ButtonControlProps } from '../ButtonControl/ButtonControl';
import { Theme, useStyles } from '@cgsweb/theme';

import { Stream } from '@cgsweb/events';
import { isKey } from '../../../utils';
import { useMap } from '../../../hooks';

type Props = ButtonControlProps & {
    toggled: boolean;
    onToggle: (toggled: boolean, e?: React.MouseEvent<HTMLButtonElement>) => void;
    toggleOffOnEscape?: boolean;
};

const ToggleControl: React.FunctionComponent<Props> = ({ className, onToggle, toggled, toggleOffOnEscape, ...props }) => {
    const map = useMap();
    const getStyle = React.useCallback(
        ({ colors, helpers }: Theme) => ({
            button: toggled
                ? {
                      '> button': {
                          backgroundColor: colors.accent,
                          borderColor: colors.font
                      },
                      '> button:hover': {
                          backgroundColor: helpers.darken(colors.accent, 0.1),
                          borderColor: colors.fontHover
                      }
                  }
                : {}
        }),
        [toggled]
    );

    React.useEffect(() => {
        if (toggleOffOnEscape && toggled) {
            const sub = Stream.fromDomEvent('keydown', map.getTargetElement())
                .filter(isKey('Escape'))
                .subscribe(() => onToggle(false));
            return () => sub.unsubscribe();
        }
        return () => {};
    }, [toggleOffOnEscape, toggled, onToggle]);

    const classNames = useStyles(getStyle);

    return <ButtonControl onClick={e => onToggle(!toggled, e)} className={classnames(className, classNames.button)} {...props} />;
};

ToggleControl.defaultProps = {
    toggleOffOnEscape: true
};
ToggleControl.displayName = 'ToggleControl';

export default ToggleControl;
