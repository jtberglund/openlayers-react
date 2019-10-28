import './Circle.scss';

import * as React from 'react';
import classnames from 'classnames';

type Props = React.SVGProps<SVGSVGElement>;

const Circle: React.FunctionComponent<Props> = ({ className, ...props }) => {
    return (
        <svg {...props} className={classnames('icon circle-icon', className)}>
            <symbol id="icon-circle" viewBox="0 0 24 24">
                <title>circle</title>
                <path d="M12 2.016c5.531 0 9.984 4.453 9.984 9.984s-4.453 9.984-9.984 9.984-9.984-4.453-9.984-9.984 4.453-9.984 9.984-9.984z" />
            </symbol>
            <use xlinkHref="#icon-circle" />
        </svg>
    );
};

Circle.defaultProps = {};
Circle.displayName = 'Circle';

export default Circle;
