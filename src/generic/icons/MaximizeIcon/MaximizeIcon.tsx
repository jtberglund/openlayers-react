import './MaximizeIcon.scss';

import * as React from 'react';
import classnames from 'classnames';

type Props = React.SVGProps<SVGSVGElement>;

/**
 * 'maximize-2' from https://feathericons.com/
 */
const MaximizeIcon: React.FunctionComponent<Props> = ({ className, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={classnames('icon', 'ol-icon', 'ol-maximize-icon', className)}
            {...props}
        >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
    );
};

MaximizeIcon.defaultProps = {};
MaximizeIcon.displayName = 'MaximizeIcon';

export default MaximizeIcon;
