import * as fs from 'fs';
import Extractor from '../src/Extractor';

describe('core', () => {
    let e: Extractor;

    beforeAll(() => {
        e = new Extractor();
    });

    test('extract-all-options', () => {
        const options = e.extractAllOptions();
        expect(Object.keys(options).length).toBeGreaterThan(0);
    });
});
