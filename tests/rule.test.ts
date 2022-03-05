import Rule from '../src/Rule';
import { DummyRule1 } from './rules.data';
import * as espree from 'espree';

describe('rule', () => {
    let r: DummyRule1;

    beforeAll(() => {
        r = new DummyRule1();
    });

    test('extract', () => {
        expect(() => r.extract()).toThrow(
            'You must override the extract method'
        );
    });

    test('test-file', () => {
        expect(() => r.testFile('', espree.parse(''), '')).toThrow(
            'Not implemented'
        );
    });

    test('test-token', () => {
        expect(() => r.testForToken('', espree.parse(''), '', 0)).toThrow(
            'Not implemented'
        );
    });

    test('store-get', () => {
        r.store('a', '--test');
        expect(r.get('a')).toBe('--test');
    });

    test('store-count', () => {
        r.store('a', true);
        r.store('b', false);
        r.store('c', true);
        expect(r.count((_, e) => e)).toBe(2);
    });
});

describe('normalization', () => {
    test('warn', () => expect(Rule.normalize('warn')).toEqual([1]));
    test('error', () => expect(Rule.normalize('error')).toEqual([2]));
    test('off', () => expect(Rule.normalize('off')).toEqual([0]));

    test('[off]', () => expect(Rule.normalize(['off'])).toEqual([0]));
    test('[warn]', () => expect(Rule.normalize(['warn'])).toEqual([1]));
    test('[error]', () => expect(Rule.normalize(['error'])).toEqual([2]));

    test('1', () => expect(Rule.normalize(1)).toEqual([1]));
    test('2', () => expect(Rule.normalize(2)).toEqual([2]));
    test('0', () => expect(Rule.normalize(0)).toEqual([0]));

    test('Rule disabled with data', () =>
        expect(Rule.normalize([0, 'test', 'some data'])).toEqual([0]));

    test('no-data', () => expect(Rule.normalize([])).toEqual([0]));

    test('other', () => expect(Rule.normalize('test')).toBe('test'));
});
