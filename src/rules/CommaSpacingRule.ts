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
        if (tokenID < 1) return;

        const { tokens } = program;
        const result: CommaSpacingOptions = { before: false, after: false };

        console.assert(tokenID < tokens.length, 'Index out of bounds');

        const token = tokens[tokenID];
        const previousToken = tokens[tokenID - 1];

        if (token.type != 'Punctuator' || token.value != ',') return;

        if (previousToken.loc.start.line != token.loc.start.line) return;

        if (tokenID + 1 < tokens.length) {
            const nextToken = tokens[tokenID + 1];

            if (nextToken.type == 'Punctuator') return;

            if (nextToken.loc.start.line != token.loc.start.line) return;

            result.after = nextToken.start != token.end;
        }

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
