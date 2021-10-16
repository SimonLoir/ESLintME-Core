import EOLLastRule from '../src/rules/EOLLastRule';
import * as fs from 'fs';
import * as espree from 'espree';
import Rule from '../src/Rule';
import FuncCallSpacingRule from '../src/rules/FuncCallSpacing';

function readFile(name: string) {
    return fs.readFileSync(__dirname + '/data/' + name).toString();
}

function getProgram(content: string) {
    return espree.parse(content, {
        range: true,
        loc: true,
        tokens: true,
        ecmaVersion: 'latest',
    });
}

describe('Enf of file', () => {
    let r: EOLLastRule;

    beforeAll(() => {
        r = new EOLLastRule();
    });

    test(EOLLastRule.esname + '/always', () => {
        const content = readFile('eol-last');
        const program = getProgram(content);

        r.testFile('a', program, content);

        expect(r.extract()?.value).toBe('always');
    });

    test(EOLLastRule.esname + '/never', () => {
        const content = readFile('eol-last-never');
        const program = getProgram(content);

        r.testFile('a', program, content);

        expect(r.extract()?.value).toBe('never');
    });

    test(EOLLastRule.esname + '/mixed', () => {
        const content = readFile('eol-last');
        const content2 = readFile('eol-last-never');

        const program = getProgram(content);
        const program2 = getProgram(content2);

        r.testFile('a', program, content);
        r.testFile('b', program2, content2);

        expect(r.extract()).toBe(null);
    });
});

/*describe('Function calls', () => {
    let r: FuncCallSpacingRule;

    beforeAll(() => {
        r = new FuncCallSpacingRule();
    });

    test(FuncCallSpacingRule.esname + '/always', () => {
        const content = readFile('func-call-spacing');
        const program = getProgram(content);

        r.testFile('a', program, content);

        expect(r.extract()?.value).toBe('always');
    });

    test(FuncCallSpacingRule.esname + '/never', () => {
        const content = readFile('func-call-spacing-2');
        const program = getProgram(content);

        r.testFile('a', program, content);

        expect(r.extract()?.value).toBe('never');
    });

    test(FuncCallSpacingRule.esname + '/mixed', () => {
        const content = readFile('func-call-spacing');
        const content2 = readFile('func-call-spacing-2');

        const program = getProgram(content);
        const program2 = getProgram(content2);

        r.testFile('a', program, content);
        r.testFile('b', program2, content2);

        expect(r.extract()).toBe(null);
    });
});
*/
