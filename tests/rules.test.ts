import EOLLastRule from '../src/rules/EOLLastRule';
import * as fs from 'fs';
import * as espree from 'espree';

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

describe('Rules', () => {
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
