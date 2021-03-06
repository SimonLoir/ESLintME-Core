import * as espree from 'espree';
import CommaSpacingRule from './rules/CommaSpacingRule';
import DotLocationRule from './rules/DotLocationRule';
import EOLLastRule from './rules/EOLLastRule';
import FuncCallSpacingRule from './rules/FuncCallSpacing';
import IndentRule from './rules/Indent';
import NoDebuggerRule from './rules/NoDebuggerRule';
import NoVarRule from './rules/NoVarRule';
export default class Extractor {
    private eolLastRule = new EOLLastRule();
    private funcCallRule = new FuncCallSpacingRule();
    private commaSpacingRule = new CommaSpacingRule();
    private dotLocationRule = new DotLocationRule();
    private indentRule = new IndentRule();
    private novarRule = new NoVarRule();
    private noDebuggerRule = new NoDebuggerRule();
    /**
     * Processes a new file
     * @param filename The name of the file
     * @param content The content of the file
     */
    public process(filename: string, content: string) {
        console.assert(filename, 'No filename was provided');
        console.assert(content, "Can't process a file without content");
        const program = espree.parse(content, {
            range: true,
            loc: true,
            tokens: true,
            ecmaVersion: 'latest',
            sourceType: 'module',
        });
        const { tokens } = program;

        this.eolLastRule.testFile(filename, program, content);
        this.indentRule.testFile(filename, program, content);

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
                    } else if (token.value == '.') {
                        this.dotLocationRule.testForToken(
                            filename,
                            program,
                            content,
                            i
                        );
                    }
                    break;
                case 'Keyword':
                    if (['var', 'let', 'const'].indexOf(token.value) >= 0) {
                        this.novarRule.testForToken(
                            filename,
                            program,
                            content,
                            i
                        );
                    }

                    if (token.value == 'debugger')
                        this.noDebuggerRule.testForToken(
                            filename,
                            program,
                            content,
                            i
                        );
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
        out[DotLocationRule.esname] = this.dotLocationRule.extract();
        out[IndentRule.esname] = this.indentRule.extract();
        out[NoVarRule.esname] = this.novarRule.extract();
        out[NoDebuggerRule.esname] = this.noDebuggerRule.extract();

        return out;
    }

    /**
     * Extracts all the possibilities found for the rules
     * @returns An array of possible values for the rules
     */
    public extractAllOptions() {
        const out: { [key: string]: RuleData[] } = {};

        out[EOLLastRule.esname] = this.eolLastRule.getAllOptions();
        out[FuncCallSpacingRule.esname] = this.funcCallRule.getAllOptions();
        out[CommaSpacingRule.esname] = this.commaSpacingRule.getAllOptions();
        out[DotLocationRule.esname] = this.dotLocationRule.getAllOptions();
        out[IndentRule.esname] = this.indentRule.getAllOptions();
        out[NoVarRule.esname] = this.novarRule.getAllOptions();
        out[NoDebuggerRule.esname] = this.noDebuggerRule.getAllOptions();

        return out;
    }
}
