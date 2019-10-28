import './Line.scss';

import * as React from 'react';
import classnames from 'classnames';

type Props = React.SVGProps<SVGSVGElement>;

const Line: React.FunctionComponent<Props> = ({ className, ...props }) => {
    return (
        <svg {...props} className={classnames('icon line-icon', className)}>
            <symbol id="icon-polyline" viewBox="0 0 24 24">
                <title>polyline</title>
                <path d="M23.016 8.016c0 1.078-0.938 1.969-2.016 1.969-0.188 0-0.375 0-0.516-0.047l-3.563 3.563c0.047 0.141 0.094 0.328 0.094 0.516 0 1.078-0.938 1.969-2.016 1.969s-2.016-0.891-2.016-1.969c0-0.188 0.047-0.375 0.094-0.516l-2.578-2.578c-0.141 0.047-0.328 0.094-0.516 0.094s-0.375-0.047-0.516-0.094l-4.547 4.547c0.047 0.141 0.094 0.328 0.094 0.516 0 1.078-0.938 2.016-2.016 2.016s-2.016-0.938-2.016-2.016 0.938-1.969 2.016-1.969c0.188 0 0.375 0 0.516 0.047l4.547-4.547c-0.047-0.141-0.047-0.328-0.047-0.516 0-1.078 0.891-2.016 1.969-2.016s2.016 0.938 2.016 2.016c0 0.188 0 0.375-0.047 0.516l2.531 2.531c0.141-0.047 0.328-0.047 0.516-0.047s0.375 0 0.516 0.047l3.563-3.516c-0.047-0.141-0.094-0.328-0.094-0.516 0-1.078 0.938-2.016 2.016-2.016s2.016 0.938 2.016 2.016z" />
            </symbol>
            <use xlinkHref="#icon-polyline" />
        </svg>
    );
};

Line.defaultProps = {};
Line.displayName = 'Line';

export default Line;
