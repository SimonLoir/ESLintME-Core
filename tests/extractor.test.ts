import Extractor from '../src/Extractor';
import * as fs from 'fs';
import NoDebuggerRule from '../src/rules/NoDebuggerRule';
import NoVarRule from '../src/rules/NoVarRule';
import CommaSpacingRule from '../src/rules/CommaSpacingRule';

function readFile(name: string) {
    return fs.readFileSync(__dirname + '/extractor-data/' + name).toString();
}

describe('core', () => {
    let e: Extractor;

    beforeAll(() => {
        e = new Extractor();
    });

    test('extract-all-options', () => {
        const options = e.extractAllOptions();
        const keys = Object.keys(options);

        expect(keys.length).toBeGreaterThan(0);
        keys.forEach((key) => {
            expect(options[key]).toBeDefined();
            expect(options[key]).toBeInstanceOf(Array);
        });
    });

    test('file1', () => {
        const file = readFile('file1');
        e.process('file.js', file);
        const data = e.extract();

        expect(data[NoDebuggerRule.esname]).toEqual({
            noValue: true,
            ruleName: NoDebuggerRule.esname,
        });

        expect(data[NoVarRule.esname]).toEqual({
            noValue: true,
            ruleName: NoVarRule.esname,
        });
    });

    test('file2', () => {
        const file = readFile('file2');
        e.process('file.js', file);
        const data = e.extract();

        expect(data[NoDebuggerRule.esname]).toBeNull();
        expect(data[CommaSpacingRule.esname]).toEqual({
            ruleName: CommaSpacingRule.esname,
            options: { before: false, after: true },
        });
    });
});
