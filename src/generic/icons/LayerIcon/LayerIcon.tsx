import './LayerIcon.scss';

import * as React from 'react';
import classnames from 'classnames';

type Props = React.SVGProps<SVGSVGElement>;

/**
 * 'layers' SVG from https://feathericons.com/
 */
const LayerIcon: React.FunctionComponent<Props> = ({ className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={classnames('icon', 'layer-icon', className)} {...props}>
        <symbol id="icon-layers" viewBox="0 0 24 24">
            <title>layers</title>
            <path d="M1.6 7.9l10 5c0.1 0.1 0.2 0.1 0.4 0.1s0.3 0 0.4-0.1l10-5c0.4-0.2 0.6-0.5 0.6-0.9s-0.2-0.7-0.6-0.9l-10-5c-0.3-0.1-0.6-0.1-0.9 0l-10 5c-0.3 0.2-0.5 0.5-0.5 0.9s0.2 0.7 0.6 0.9zM12 3.1l7.8 3.9-7.8 3.9-7.8-3.9 7.8-3.9z" />
            <path d="M21.6 16.1l-9.6 4.8-9.6-4.8c-0.5-0.2-1.1 0-1.3 0.4s0 1.1 0.4 1.3l10 5c0.2 0.2 0.3 0.2 0.5 0.2s0.3 0 0.4-0.1l10-5c0.5-0.2 0.7-0.8 0.4-1.3-0.2-0.5-0.8-0.7-1.2-0.5z" />
            <path d="M21.6 11.1l-9.6 4.8-9.6-4.8c-0.5-0.2-1.1 0-1.3 0.4-0.2 0.5 0 1.1 0.4 1.3l10 5c0.2 0.2 0.3 0.2 0.5 0.2s0.3 0 0.4-0.1l10-5c0.5-0.2 0.7-0.8 0.4-1.3-0.2-0.5-0.8-0.7-1.2-0.5z" />
        </symbol>
        <use xlinkHref="#icon-layers" />
    </svg>
);

LayerIcon.defaultProps = {};
LayerIcon.displayName = 'LayerIcon';

export default LayerIcon;
