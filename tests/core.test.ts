import * as fs from 'fs';
import * as yaml from 'js-yaml';
import Core from '../src/Core';
import IndentRule from '../src/rules/Indent';

describe('core', () => {
    let core: Core;

    beforeAll(() => {
        core = new Core();
    });

    test('get-rule', () => {
        expect(Core.getRule('indent')).toBe(IndentRule);
    });

    test('get-undefined-rule', () => {
        expect(() => Core.getRule('abcd')).toThrowError(
            'The rule could not be found'
        );
    });

    test('set-named-ruleset', () => {
        core.setNamedRuleset('test', { indent: 'error' });
        core.setRulesOrder([
            { enabled: true, force: true, id: 'test', name: 'test' },
        ]);
        expect(core.getRules()).toEqual({ indent: 'error' });
    });

    test('no-rules-order', () => {
        core.setRulesOrder([]);
        expect(core.getRules()).toEqual(core.extractRules());
    });

    test('disabled-set', () => {
        core.setRulesOrder([
            { enabled: false, force: true, id: 'test', name: 'test' },
        ]);
        expect(core.getRules()).toEqual({});
    });

    test('set-type-none', () => {
        core.setRulesOrder([
            { enabled: true, force: true, id: 'None', name: 'None' },
        ]);
        expect(core.getRules()).toEqual({});
    });

    test('set-does-not-exist', () => {
        core.setNamedRuleset('test', { indent: 'error' });
        core.setRulesOrder([
            { enabled: true, force: true, id: 'abc', name: 'abc' },
        ]);
        expect(core.getRules()).toEqual({});
    });

    test('using-found-rules', () => {
        core.setRulesOrder([
            { enabled: true, force: true, id: 'found', name: 'found rules' },
        ]);
        expect(core.getRules()).toEqual(core.extractRules());
    });

    test('rule-exception', () => {
        core.addRuleException('indent', [0]);

        expect(core.exceptions).toEqual({ indent: [0] });

        expect(JSON.parse(core.export('json')).rules).toEqual({
            ...core.extractRules(),
            ...{ indent: [0] },
        });
    });

    test('remove-rule-exception', () => {
        core.addRuleException('indent', [0]);
        core.removeException('indent');

        expect(core.exceptions).toEqual({});
    });

    test('env', () => {
        core.env = { browser: true };
        expect(core.env).toEqual({ browser: true });
    });

    test('normalize', () => {
        expect(core.normalize('indent', 'error')).toEqual([2]);
    });

    test('all-options', () => {
        const opt = core.getAllOptions();
        expect(opt).toBeDefined();
        const keys = Object.keys(opt);
        expect(keys.length).toBeGreaterThan(0);
        keys.forEach((key) => {
            expect(opt[key]).toBeDefined();
            expect(opt[key]).toBeInstanceOf(Array);
        });
    });

    test('export-js', () => {
        const js = core.export('js');
        expect(js.indexOf('module.exports = ')).toBeGreaterThanOrEqual(0);
        expect(js.indexOf(core.export('json'))).toBeGreaterThanOrEqual(0);
    });

    test('export-yml', () => {
        const yml = core.export('yml');
        const json = JSON.parse(core.export('json'));
        const parsedYaml = yaml.load(yml);
        expect(parsedYaml).toEqual(json);
    });
});
