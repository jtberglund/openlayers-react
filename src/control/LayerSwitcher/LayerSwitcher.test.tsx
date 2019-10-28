import { act, cleanup, testHook } from 'react-testing-library';

import Collection from 'ol/Collection';
import TileLayer from 'ol/layer/Tile';
import { useSelectedLayer } from './LayerSwitcher';

// tslint:disable:react-hooks-nesting
describe('LayerSwitcher', () => {
    describe('useSelectedLayer', () => {
        afterAll(cleanup);

        function makeLayer(id: string, props): TileLayer {
            let visible = props.visible;
            const layer = {
                setVisible: v => (visible = v),
                getVisible: () => visible,
                get: key => (key === 'id' ? id : undefined)
            };
            return layer as any;
        }

        test('Returns the ID of the first visible layer', () => {
            const collection = new Collection<TileLayer>();
            collection.push(makeLayer('layer1', { visible: true }));
            collection.push(makeLayer('layer2', { visible: false }));

            let visibleLayerId;
            testHook(() => ([visibleLayerId] = useSelectedLayer(collection)));

            expect(visibleLayerId).toBe('layer1');
        });

        test('Selects the first "visible" layer and hides all others', () => {
            const collection = new Collection<TileLayer>();
            collection.push(makeLayer('layer1', { visible: true }));
            collection.push(makeLayer('layer2', { visible: true }));

            let visibleLayerId;
            testHook(() => ([visibleLayerId] = useSelectedLayer(collection)));

            expect(visibleLayerId).toBe('layer1');

            expect(collection.getArray()[0].getVisible()).toBe(true);
            expect(collection.getArray()[1].getVisible()).toBe(false);
        });

        test('Works when layers are added after the component has mounted', () => {
            const collection = new Collection<TileLayer>();

            let visibleLayerId;
            const { rerender } = testHook(() => ([visibleLayerId] = useSelectedLayer(collection)));

            expect(visibleLayerId).toBe(undefined);

            // Need to wrap in `act` since this will trigger a state update in the hook
            act(() => {
                collection.push(makeLayer('layer1', { visible: false }));
                collection.push(makeLayer('layer2', { visible: true }));
            });

            rerender();

            expect(visibleLayerId).toBe('layer2');

            act(() => {
                collection.push(makeLayer('layer3', { visible: true }));
            });

            // Should set `{ visible: false }` on the newly-added layer since we already have a visible layer
            expect(collection.getArray()[2].getVisible()).toBe(false);
        });

        test('Returns a "setVisibleLayerId" function to update the visible layer', () => {
            const collection = new Collection<TileLayer>();
            collection.push(makeLayer('layer1', { visible: true }));
            collection.push(makeLayer('layer2', { visible: false }));

            let visibleLayerId;
            let setVisibleLayerId;
            testHook(() => ([visibleLayerId, setVisibleLayerId] = useSelectedLayer(collection)));

            expect(visibleLayerId).toBe('layer1');

            act(() => setVisibleLayerId('layer2'));

            expect(visibleLayerId).toBe('layer2');
            expect(collection.getArray()[0].getVisible()).toBe(false);
            expect(collection.getArray()[1].getVisible()).toBe(true);
        });
    });
});
