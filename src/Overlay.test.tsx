import * as React from 'react';

import { cleanup, render } from 'react-testing-library';

import { OpenLayersContext } from '../context';
import Overlay from './Overlay';

describe('Overlay', () => {
    const map: any = {
        addOverlay: jest.fn(),
        removeOverlay: jest.fn()
    };

    beforeEach(() => {
        map.addOverlay = jest.fn();
        map.removeOverlay = jest.fn();
    });

    afterEach(() => {
        cleanup();
    });

    test('Added to the map when "show" is true', () => {
        render(
            <OpenLayersContext.Provider value={{ map }}>
                <Overlay />
            </OpenLayersContext.Provider>
        );

        expect(map.addOverlay).toHaveBeenCalled();
    });

    test('Not added when "show" is false', () => {
        render(
            <OpenLayersContext.Provider value={{ map }}>
                <Overlay show={false} />
            </OpenLayersContext.Provider>
        );

        expect(map.addOverlay).not.toHaveBeenCalled();
    });

    test('Adds and removes the overlay when "show" changes', () => {
        const { rerender } = render(
            <OpenLayersContext.Provider value={{ map }}>
                <Overlay />
            </OpenLayersContext.Provider>
        );

        expect(map.addOverlay).toHaveBeenCalledTimes(1);

        rerender(
            <OpenLayersContext.Provider value={{ map }}>
                <Overlay show={false} />
            </OpenLayersContext.Provider>
        );

        expect(map.removeOverlay).toHaveBeenCalledTimes(1);
    });

    test('Removes the overlay when unmounted', () => {
        const { unmount } = render(
            <OpenLayersContext.Provider value={{ map }}>
                <Overlay />
            </OpenLayersContext.Provider>
        );

        expect(map.addOverlay).toHaveBeenCalled();
        expect(map.addOverlay).toHaveBeenCalledTimes(1);
        expect(map.removeOverlay).not.toHaveBeenCalled();

        unmount();

        expect(map.removeOverlay).toBeCalledTimes(1);
    });
});
