import Rule from '../Rule';
import * as espree from 'espree';

interface CommaSpacingOptions {
    before: boolean;
    after: boolean;
}

export default class CommaSpacingRule extends Rule<CommaSpacingOptions> {
    public static esname = 'comma-spacing';

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
        const result: CommaSpacingOptions = { before: false, after: false };

        console.assert(tokenID < tokens.length, 'Index out of bounds');

        const token = tokens[tokenID];
        const previousToken = tokens[tokenID - 1];

        // We are only looking for commas in the code
        if (token.type != 'Punctuator' || token.value != ',') return;

        // The previous token should be on the same line as the comma
        if (previousToken.loc.start.line != token.loc.start.line) return;

        if (tokenID + 1 < tokens.length) {
            const nextToken = tokens[tokenID + 1];
            // In case of a trailing comma
            if (nextToken.type == 'Punctuator') return;

            // The next token should be on the same line as the comma
            if (nextToken.loc.start.line != token.loc.start.line) return;

            result.after = nextToken.start != token.end;
        }

        // Typical example : [,5, 10]
        if (previousToken.type == 'Punctuator') return;

        result.before = previousToken.end != token.start;

        this.store(filename + ':' + tokenID, result);
    }

    public extract() {
        let result: RuleData,
            before: boolean = false,
            after: boolean = true;

        if (this.length == 0) return null;

        if (this.all((_, e) => e.before == true)) before = true;
        if (this.all((_, e) => e.after == false)) after = false;

        result = {
            ruleName: CommaSpacingRule.esname,
            options: { before, after },
        };

        return result;
    }
}
