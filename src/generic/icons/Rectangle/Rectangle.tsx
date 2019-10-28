import './Rectangle.scss';

import * as React from 'react';
import classnames from 'classnames';

type Props = React.SVGProps<SVGSVGElement>;

const Rectangle: React.FunctionComponent<Props> = ({ className, ...props }) => {
    return (
        <svg {...props} className={classnames('icon rectangle-icon', className)}>
            <symbol id="icon-rectangle" viewBox="0 0 20 20">
                <title>rectangle</title>
                <path d="M2.5 2.5h15v15h-15z" />
            </symbol>
            <use xlinkHref="#icon-rectangle" />
        </svg>
    );
};

Rectangle.defaultProps = {};
Rectangle.displayName = 'Rectangle';

export default Rectangle;
