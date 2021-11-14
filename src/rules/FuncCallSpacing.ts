import Rule from '../Rule';
import * as espree from 'espree';

export default class FuncCallSpacingRule extends Rule<boolean> {
    public static esname = 'func-call-spacing';
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

        // Cannot be a function call since there is no char before
        if (tokenID < 1) return;

        const { tokens } = program;

        console.assert(tokenID < tokens.length, 'Index out of bounds');

        const token = tokens[tokenID];
        const previousToken = tokens[tokenID - 1];

        if (token.type != 'Punctuator' || token.value != '(') return;

        // It's not a function call but it might be a "if", ...
        if (previousToken.type != 'Identifier') return;

        if (['async', 'await', 'yield', 'of'].indexOf(previousToken.value) > -1)
            return;

        // If it is a function declaration
        if (tokenID > 1) {
            const pToken = tokens[tokenID - 2];
            if (pToken.type == 'Keyword' && pToken.value == 'function') return;
        }

        // We store whether or not we use a space before the parenthesis
        this.store(filename + ':' + tokenID, previousToken.end != token.start);

        //debug : if (previousToken.end != token.start) console.log(previousToken, token);
    }

    public extract() {
        let result: RuleData | null = null;
        // Checks if all the function calls use a space before the parenthesis
        if (this.all((_, e) => e == true))
            result = { ruleName: FuncCallSpacingRule.esname, value: 'always' };
        // Checks if none use a space
        else if (this.all((_, e) => e == false))
            result = { ruleName: FuncCallSpacingRule.esname, value: 'never' };
        // At this point, it is impossible to find a pattern
        return result;
    }

    public static normalize(data: any) {
        data = Rule.normalize(data);
        if (Array.isArray(data)) {
            if (data.length > 1) {
                if (data[1] == 'never') return [data[0]];
                if (data.length == 3 && typeof data[2] == 'object') {
                    if (data[2].allowNewlines)
                        return [data[0], 'always', { allowNewlines: true }];
                    else return [data[0], 'always'];
                }
            }
        }
        return data;
    }
}
