import * as espree from 'espree';
import EOLLastRule from './rules/EOLLastRule';
export default class Extractor {
    private eolLastRule = new EOLLastRule();

    /**
     * Processes a new file
     * @param filename The name of the file
     * @param content The content of the file
     */
    public process(filename: string, content: string) {
        const program = espree.parse(content, {
            range: true,
            loc: true,
            tokens: true,
            ecmaVersion: 'latest',
        });

        this.eolLastRule.testFile(filename, program, content);
    }

    /**
     * Extracts rules from the tests performed
     * @returns A dictionary of the tests results identified by the rule names
     */
    public extract() {
        const out: { [key: string]: RuleData | null } = {};

        out[EOLLastRule.esname] = this.eolLastRule.extract();
        return out;
    }
}
