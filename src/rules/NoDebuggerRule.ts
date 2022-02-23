import Rule from '../Rule';
import * as espree from 'espree';

export default class NoDebuggerRule extends Rule<boolean> {
    static esname = 'no-debugger';
    public testForToken(
        filename: string,
        program: espree.Program,
        content: string,
        tokenID: number
    ) {
        console.assert(filename, 'No filename was specified');
        console.assert(
            program && program.tokens,
            'The program should be defined and the tokens should be defined'
        );
        console.assert(tokenID >= 0, 'The token ID must be greater than 0');

        const { tokens } = program;

        console.assert(tokenID < tokens.length, 'Index out of bounds');

        const token = tokens[tokenID];

        console.assert(
            token.type == 'Keyword',
            'Incorrect token type, "Keyword" expected'
        );

        console.assert(
            token.value == 'debugger',
            "The token values does not match 'debugger'"
        );

        this.store(`${filename}:${tokenID}`, true);
    }

    public extract() {
        if (this.length == 0)
            return {
                ruleName: NoDebuggerRule.esname,
                noValue: true,
            } as RuleData;
        return null;
    }

    public static normalize(data: any) {
        return Rule.normalize(data);
    }

    public getAllOptions(): RuleData[] {
        /**
         * Those options should be removed
         */
        return [
            { ruleName: NoDebuggerRule.esname, noValue: true },
            { ruleName: NoDebuggerRule.esname, options: { test: true } },
        ];
    }
}
