import * as React from 'react';

import DrawInteraction, { Options } from 'ol/interaction/Draw';

import Event from 'ol/events/Event';
import Feature from 'ol/Feature';
import { InteractionProps } from './Interaction';
import { Omit } from '@cgsweb/util';
import { useInteraction } from '../../hooks';
import { values } from 'lodash/fp';

export interface DrawEvent extends Event {
    feature: Feature;
}

export enum DrawType {
    POINT = 'Point',
    LINE_STRING = 'LineString',
    POLYGON = 'Polygon',
    CIRCLE = 'Circle'
}

type DrawOptions = Omit<Options, 'type'>;
export type DrawProps = InteractionProps &
    DrawOptions & {
        onDrawStart?: (e: DrawEvent) => void;
        onDrawEnd?: (e: DrawEvent) => void;
        type: DrawType;
        active?: boolean;
    };

const Draw: React.FunctionComponent<DrawProps> = ({ onDrawStart, onDrawEnd, active, ...options }) => {
    const drawInteraction = React.useRef<DrawInteraction>(null);

    useInteraction(
        () => {
            drawInteraction.current = new DrawInteraction({
                ...options
            });
            return drawInteraction.current;
        },
        { active },
        values(options)
    );

    React.useEffect(() => {
        drawInteraction.current.on('drawstart', onDrawStart);
        drawInteraction.current.on('drawend', onDrawEnd);
        return () => {
            drawInteraction.current.un('drawStart', onDrawStart);
            drawInteraction.current.un('drawend', onDrawEnd);
        };
    }, [drawInteraction.current, onDrawStart, onDrawEnd]);

    return null;
};

Draw.defaultProps = {
    active: true,
    onDrawStart: () => {},
    onDrawEnd: () => {}
};
Draw.displayName = 'Draw';

export default Draw;
