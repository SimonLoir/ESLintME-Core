import Rule from '../Rule';
import * as espree from 'espree';

export default class NoVarRule extends Rule<boolean> {
    public static esname = 'no-var';

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
            ['var', 'let', 'const'].indexOf(token.value) >= 0,
            "The token value is not of type 'var', 'let', 'const'"
        );

        this.store(`${filename}:${tokenID}`, token.value == 'var');
    }

    public extract() {
        // Requires all entries to be false
        if (this.all((_, e) => !e))
            return { ruleName: NoVarRule.esname, noValue: true } as RuleData;
        return null;
    }

    public static normalize(data: any) {
        return Rule.normalize(data);
    }
}
