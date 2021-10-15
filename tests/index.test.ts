import Extractor from '../src/Extractor';

describe('test', () => {
    test('EOLLast - always', () => {
        const e = new Extractor();
        e.process(
            'file1.js',
            `
function test(){
    console.log('hello world');
}
`
        );
        e.process(
            'file2.js',
            `
function test(){
    console.log('hello world');
}

test();
`
        );

        expect(e.eolLastRule.extract()?.value).toBe('always');
    });

    test('EOLLast - never', () => {
        const e = new Extractor();
        e.process(
            'file1.js',
            `
function test(){
    console.log('hello world');
}`
        );
        e.process(
            'file2.js',
            `
function test(){
    console.log('hello world');
}

test();`
        );

        expect(e.eolLastRule.extract()?.value).toBe('never');
    });

    test('EOLLast - not determined', () => {
        const e = new Extractor();
        e.process(
            'file1.js',
            `
function test(){
    console.log('hello world');
}
`
        );
        e.process(
            'file2.js',
            `
function test(){
    console.log('hello world');
}

test();`
        );

        expect(e.eolLastRule.extract()).toBe(null);
    });
});
