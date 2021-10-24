import EOLLastRule from '../src/rules/EOLLastRule';
import * as fs from 'fs';
import * as espree from 'espree';
import CommaSpacingRule from '../src/rules/CommaSpacingRule';
import DotLocationRule from '../src/rules/DotLocationRule';
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

describe(EOLLastRule.esname, () => {
    let r: EOLLastRule;

    beforeAll(() => {
        r = new EOLLastRule();
    });

    test('always', () => {
        const content = readFile('eol-last');
        const program = getProgram(content);

        r.testFile('a', program, content);

        expect(r.extract()?.value).toBe('always');
    });

    test('never', () => {
        const content = readFile('eol-last-never');
        const program = getProgram(content);

        r.testFile('a', program, content);

        expect(r.extract()?.value).toBe('never');
    });

    test('mixed', () => {
        const content = readFile('eol-last');
        const content2 = readFile('eol-last-never');

        const program = getProgram(content);
        const program2 = getProgram(content2);

        r.testFile('a', program, content);
        r.testFile('b', program2, content2);

        expect(r.extract()).toBe(null);
    });
});

describe(CommaSpacingRule.esname, () => {
    let r: CommaSpacingRule;

    beforeAll(() => {
        r = new CommaSpacingRule();
    });

    test('before:false - after:true', () => {
        const content = readFile('comma-spacing');
        const program = getProgram(content);

        program.tokens.forEach((t, id) => {
            r.testForToken('a.js', program, content, id);
        });

        const options = r.extract()?.options;

        expect(options?.before).toBe(false);
        expect(options?.after).toBe(true);
    });

    test('before:true - after:false', () => {
        const content = readFile('comma-spacing-2');
        const program = getProgram(content);

        program.tokens.forEach((t, id) => {
            r.testForToken('a.js', program, content, id);
        });

        const options = r.extract()?.options;

        expect(options?.before).toBe(true);
        expect(options?.after).toBe(false);
    });
});

describe(DotLocationRule.esname, () => {
    let r: DotLocationRule;

    beforeAll(() => {
        r = new DotLocationRule();
    });

    test('object', () => {
        const content = readFile('dot-location-2');
        const program = getProgram(content);

        program.tokens.forEach((t, id) => {
            r.testForToken('a.js', program, content, id);
        });

        expect(r.extract()?.value).toBe('object');
    });

    test('property', () => {
        const content = readFile('dot-location');
        const program = getProgram(content);

        program.tokens.forEach((t, id) => {
            r.testForToken('a.js', program, content, id);
        });

        expect(r.extract()?.value).toBe('property');
    });

    test('mixed', () => {
        const content = readFile('dot-location-3');
        const program = getProgram(content);

        program.tokens.forEach((t, id) => {
            r.testForToken('a.js', program, content, id);
        });

        expect(r.extract()).toBe(null);
    });
});

describe(FuncCallSpacingRule.esname, () => {
    let r: FuncCallSpacingRule;

    beforeAll(() => {
        r = new FuncCallSpacingRule();
    });

    test('always', () => {
        const content = readFile('func-call-spacing');
        const program = getProgram(content);

        program.tokens.forEach((t, id) => {
            r.testForToken('a.js', program, content, id);
        });

        expect(r.extract()?.value).toBe('always');
    });

    test('never', () => {
        const content = readFile('func-call-spacing-2');
        const program = getProgram(content);

        program.tokens.forEach((t, id) => {
            r.testForToken('a.js', program, content, id);
        });

        expect(r.extract()?.value).toBe('never');
    });
});
