import './Triangle.scss';

import * as React from 'react';
import classnames from 'classnames';

type Props = React.SVGProps<SVGSVGElement>;

const Triangle: React.FunctionComponent<Props> = ({ className, ...props }) => {
    return (
        <svg className={classnames('icon', 'triangle-icon', className)} {...props}>
            <symbol id="icon-triangle" viewBox="0 0 24 24">
                <title>triangle</title>
                <path d="M2.016 21.984l19.969-19.969v19.969h-19.969z" />
            </symbol>
            <use xlinkHref="#icon-triangle" />
        </svg>
    );
};

Triangle.defaultProps = {};
Triangle.displayName = 'Component';

export default Triangle;
