import * as React from 'react';
import classnames from 'classnames';

import OlScaleLine, { Options } from 'ol/control/ScaleLine';
import { Theme, Themed } from '@cgsweb/theme';

import { Omit } from '@cgsweb/util';
import { useControl } from '../../../hooks';

export enum Units {
    DEGREES = 'degrees',
    NAUTICAL = 'nautical',
    US = 'us',
    IMPERIAL = 'imperial',
    METRIC = 'metric'
}
type Props = Omit<Options, 'units'> & {
    units?: Units;
};

const ScaleLine: React.FunctionComponent<Props> = ({ className, ...props }) => {
    useControl(
        () =>
            new OlScaleLine({
                className: classnames(className, 'ol-scale-line'),
                ...props
            })
    );
    return null;
};

ScaleLine.defaultProps = {
    units: Units.METRIC
};
ScaleLine.displayName = 'ScaleLine';

const getStyle = ({ colors }: Theme) => ({
    scaleLine: {
        backgroundColor: colors.tier3,
        '> .ol-scale-line-inner': {
            color: colors.font,
            borderColor: colors.font
        }
    }
});

const ThemedScaleLine: React.FunctionComponent<Props> = props => (
    <Themed style={getStyle}>
        {({ classNames }) => <ScaleLine className={classnames(props.className, classNames.scaleLine)} {...props} />}
    </Themed>
);

ThemedScaleLine.displayName = 'ScaleLine';

export default ThemedScaleLine;
