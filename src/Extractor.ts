import * as espree from 'espree';
import CommaSpacingRule from './rules/CommaSpacingRule';
import EOLLastRule from './rules/EOLLastRule';
import FuncCallSpacingRule from './rules/FuncCallSpacing';
export default class Extractor {
    private eolLastRule = new EOLLastRule();
    private funcCallRule = new FuncCallSpacingRule();
    private commaSpacingRule = new CommaSpacingRule();

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
        const { tokens } = program;

        this.eolLastRule.testFile(filename, program, content);

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            switch (token.type) {
                case 'Punctuator':
                    if (token.value == '(') {
                        this.funcCallRule.testForToken(
                            filename,
                            program,
                            content,
                            i
                        );
                    } else if (token.value == ',') {
                        this.commaSpacingRule.testForToken(
                            filename,
                            program,
                            content,
                            i
                        );
                    }
                    break;

                default:
                    break;
            }
        }
    }

    /**
     * Extracts rules from the tests performed
     * @returns A dictionary of the tests results identified by the rule names
     */
    public extract() {
        const out: { [key: string]: RuleData | null } = {};

        out[EOLLastRule.esname] = this.eolLastRule.extract();
        out[FuncCallSpacingRule.esname] = this.funcCallRule.extract();
        out[CommaSpacingRule.esname] = this.commaSpacingRule.extract();

        return out;
    }
}
