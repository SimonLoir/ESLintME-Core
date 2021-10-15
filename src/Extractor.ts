import * as esprima from 'esprima';
import EOLLastRule from './rules/EOLLastRule';
export default class Extractor {
    public eolLastRule = new EOLLastRule();
    public process(filename: string, content: string) {
        const program = esprima.parseScript(content, {
            range: true,
            loc: true,
            tokens: true,
        });

        this.eolLastRule.testFile(filename, program, content);
        return;
    }
}
