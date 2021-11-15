import Rule from '../Rule';
import * as espree from 'espree';

export default class DotLocationRule extends Rule<'object' | 'property'> {
    public static esname = 'dot-location';

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

        if (tokenID < 1) return;

        const { tokens } = program;

        console.assert(tokenID < tokens.length, 'Index out of bounds');

        if (tokenID + 1 >= tokens.length) return;

        const token = tokens[tokenID];
        const previousToken = tokens[tokenID - 1];
        const nextToken = tokens[tokenID + 1];

        // We are only looking for dots in the code
        if (token.type != 'Punctuator' || token.value != '.') return;

        // If the three tokens are on the same line
        if (
            previousToken.loc.end.line == token.loc.start.line &&
            token.loc.start.line == nextToken.loc.start.line
        )
            return;

        // If the three tokens are on three different lines
        if (
            previousToken.loc.end.line != token.loc.start.line &&
            token.loc.start.line != nextToken.loc.start.line
        )
            return;

        this.store(
            filename + ':' + tokenID,
            previousToken.loc.end.line == token.loc.start.line
                ? 'object'
                : 'property'
        );
    }

    public extract() {
        let result: RuleData | null = null;

        if (this.all((_, e) => e == 'object'))
            result = { ruleName: DotLocationRule.esname, value: 'object' };

        if (this.all((_, e) => e == 'property'))
            result = { ruleName: DotLocationRule.esname, value: 'property' };

        return result;
    }

    public static normalize(data: any) {
        data = Rule.normalize(data);

        if (Array.isArray(data)) {
            if (data.length == 2) {
                if (data[1] == 'object') data = [data[0]];
            }
        }

        return data;
    }
}
