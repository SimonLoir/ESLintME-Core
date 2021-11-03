import * as espree from 'espree';
import CommaSpacingRule from './rules/CommaSpacingRule';
import DotLocationRule from './rules/DotLocationRule';
import EOLLastRule from './rules/EOLLastRule';
import FuncCallSpacingRule from './rules/FuncCallSpacing';
type progressTracker = (
    current: number,
    total: number,
    file: string,
    ratio: number
) => void;
export default class Extractor {
    private eolLastRule = new EOLLastRule();
    private funcCallRule = new FuncCallSpacingRule();
    private commaSpacingRule = new CommaSpacingRule();
    private dotLocationRule = new DotLocationRule();
    private progressHandler: progressTracker = (c, t, file, r) => {
        console.log(`$${file} > task ${c} out of ${t}, ${r * 100}%`);
    };
    private totalTasks = 0;
    private currentTask = 0;
    private currentFile: string = '';

    private progress(by: number = 1, shoudUpdate = true) {}

    /**
     * Processes a new file
     * @param filename The name of the file
     * @param content The content of the file
     */
    public process(filename: string, content: string) {
        this.currentFile = filename;
        const program = espree.parse(content, {
            range: true,
            loc: true,
            tokens: true,
            ecmaVersion: 'latest',
        });
        const { tokens } = program;

        this.totalTasks = 1 + tokens.length;
        this.currentTask = 0;

        this.eolLastRule.testFile(filename, program, content);
        this.progress();

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

                default:
                    break;
            }

            this.progress(1, i % 10000 == 0);
        }
        this.progress(0);
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

        return out;
    }

    public onProgress(callback: progressTracker) {
        this.progressHandler = callback;
    }
}
