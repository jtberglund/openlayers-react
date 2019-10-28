import './MinimizeIcon.scss';

import * as React from 'react';
import classnames from 'classnames';

type Props = React.SVGProps<SVGSVGElement>;

const MinimizeIcon: React.FunctionComponent<Props> = ({ className, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={classnames('icon', 'ol-icon', 'ol-minimize-icon', className)}
            {...props}
        >
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
    );
};

MinimizeIcon.defaultProps = {};
MinimizeIcon.displayName = 'MinimizeIcon';

export default MinimizeIcon;
