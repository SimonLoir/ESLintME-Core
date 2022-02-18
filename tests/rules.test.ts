import * as fs from 'fs';
import * as espree from 'espree';
import EOLLastRule from '../src/rules/EOLLastRule';
import CommaSpacingRule from '../src/rules/CommaSpacingRule';
import DotLocationRule from '../src/rules/DotLocationRule';
import FuncCallSpacingRule from '../src/rules/FuncCallSpacing';
import IndentRule from '../src/rules/Indent';
import Rule from '../src/Rule';

/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str, newStr: any) {
        // If a regex pattern
        if (
            Object.prototype.toString.call(str).toLowerCase() ===
            '[object regexp]'
        ) {
            return this.replace(str, newStr);
        }

        // If a string
        return this.replace(new RegExp(str, 'g'), newStr);
    };
}

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

    test('normalize', () => {
        expect(EOLLastRule.normalize('error')).toEqual([2]);
        expect(EOLLastRule.normalize('warn')).toEqual([1]);
        expect(EOLLastRule.normalize('off')).toEqual([0]);

        expect(EOLLastRule.normalize(2)).toEqual([2]);
        expect(EOLLastRule.normalize(1)).toEqual([1]);
        expect(EOLLastRule.normalize(0)).toEqual([0]);

        expect(EOLLastRule.normalize([0, 'never'])).toEqual([0]);
        expect(EOLLastRule.normalize([0, 'always'])).toEqual([0]);
        expect(EOLLastRule.normalize(['off', 'always'])).toEqual([0]);
        expect(EOLLastRule.normalize(['off', 'never'])).toEqual([0]);

        expect(EOLLastRule.normalize([2, 'never'])).toEqual([2, 'never']);
        expect(EOLLastRule.normalize([1, 'never'])).toEqual([1, 'never']);
        expect(EOLLastRule.normalize([2, 'unix'])).toEqual([2]);
        expect(EOLLastRule.normalize([2, 'windows'])).toEqual([2]);
        expect(EOLLastRule.normalize([2, 'always'])).toEqual([2]);
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

    test('normalize', () => {
        expect(DotLocationRule.normalize('error')).toEqual([2]);
        expect(DotLocationRule.normalize('warn')).toEqual([1]);
        expect(DotLocationRule.normalize('off')).toEqual([0]);

        expect(DotLocationRule.normalize(2)).toEqual([2]);
        expect(DotLocationRule.normalize(1)).toEqual([1]);
        expect(DotLocationRule.normalize(0)).toEqual([0]);

        expect(DotLocationRule.normalize([0, 'property'])).toEqual([0]);
        expect(DotLocationRule.normalize([0, 'object'])).toEqual([0]);
        expect(DotLocationRule.normalize(['off', 'object'])).toEqual([0]);
        expect(DotLocationRule.normalize(['off', 'property'])).toEqual([0]);

        expect(DotLocationRule.normalize([2, 'property'])).toEqual([
            2,
            'property',
        ]);
        expect(DotLocationRule.normalize([1, 'property'])).toEqual([
            1,
            'property',
        ]);
        expect(DotLocationRule.normalize([2, 'object'])).toEqual([2]);
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

    test('normalize', () => {
        expect(FuncCallSpacingRule.normalize('error')).toEqual([2]);
        expect(FuncCallSpacingRule.normalize('warn')).toEqual([1]);
        expect(FuncCallSpacingRule.normalize('off')).toEqual([0]);

        expect(FuncCallSpacingRule.normalize(2)).toEqual([2]);
        expect(FuncCallSpacingRule.normalize(1)).toEqual([1]);
        expect(FuncCallSpacingRule.normalize(0)).toEqual([0]);

        expect(FuncCallSpacingRule.normalize([0, 'never'])).toEqual([0]);
        expect(FuncCallSpacingRule.normalize([0, 'always'])).toEqual([0]);
        expect(FuncCallSpacingRule.normalize(['off', 'always'])).toEqual([0]);
        expect(FuncCallSpacingRule.normalize(['off', 'never'])).toEqual([0]);

        expect(FuncCallSpacingRule.normalize(['error', 'never'])).toEqual([2]);
        expect(FuncCallSpacingRule.normalize(['error', 'always'])).toEqual([
            2,
            'always',
        ]);
        expect(
            FuncCallSpacingRule.normalize([
                'error',
                'always',
                { allowNewlines: false },
            ])
        ).toEqual([2, 'always']);
        expect(
            FuncCallSpacingRule.normalize([
                'error',
                'always',
                { allowNewlines: true },
            ])
        ).toEqual([2, 'always', { allowNewlines: true }]);
    });
});

describe(IndentRule.esname, () => {
    let r: IndentRule;

    beforeAll(() => {
        r = new IndentRule();
    });

    test('2', () => {
        const content = readFile('indent-2');
        const program = getProgram(content);

        r.testFile('a', program, content);

        expect(r.extract()?.value).toBe(2);
    });

    test('4', () => {
        const content = readFile('indent-4');
        const program = getProgram(content);

        r.testFile('a', program, content);

        expect(r.extract()?.value).toBe(4);
    });

    test('tab', () => {
        const content = readFile('indent-tab');
        const program = getProgram(content);

        r.testFile('a', program, content);

        expect(r.extract()?.value).toBe('tab');
    });
});

describe('normalization', () => {
    test('warn', () => expect(Rule.normalize('warn')).toEqual([1]));
    test('error', () => expect(Rule.normalize('error')).toEqual([2]));
    test('off', () => expect(Rule.normalize('off')).toEqual([0]));

    test('[warn]', () => expect(Rule.normalize(['warn'])).toEqual([1]));
    test('[error]', () => expect(Rule.normalize(['error'])).toEqual([2]));
    test('[off]', () => expect(Rule.normalize(['off'])).toEqual([0]));

    test('1', () => expect(Rule.normalize(1)).toEqual([1]));
    test('2', () => expect(Rule.normalize(2)).toEqual([2]));
    test('0', () => expect(Rule.normalize(0)).toEqual([0]));

    test('Rule disabled with data', () =>
        expect(Rule.normalize([0, 'test', 'some data'])).toEqual([0]));
});
