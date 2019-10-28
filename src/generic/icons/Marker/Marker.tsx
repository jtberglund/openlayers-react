import './Marker.scss';

import * as React from 'react';
import classnames from 'classnames';

type Props = React.SVGProps<SVGSVGElement>;

const Marker: React.FunctionComponent<Props> = ({ className, ...props }) => {
    return (
        <svg {...props} className={classnames('icon marker-icon', className)}>
            <symbol id="icon-marker" viewBox="0 0 24 24">
                <title>marker</title>
                <path d="M12 11.484c1.359 0 2.484-1.125 2.484-2.484s-1.125-2.484-2.484-2.484-2.484 1.125-2.484 2.484 1.125 2.484 2.484 2.484zM12 2.016c3.891 0 6.984 3.094 6.984 6.984 0 5.25-6.984 12.984-6.984 12.984s-6.984-7.734-6.984-12.984c0-3.891 3.094-6.984 6.984-6.984z" />
            </symbol>
            <use xlinkHref="#icon-marker" />
        </svg>
    );
};

Marker.defaultProps = {};
Marker.displayName = 'Marker';

export default Marker;
