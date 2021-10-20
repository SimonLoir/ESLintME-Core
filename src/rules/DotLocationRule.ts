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
        if (tokenID < 1) return;

        const { tokens } = program;

        console.assert(tokenID < tokens.length, 'Index out of bounds');

        if (tokenID + 1 >= tokens.length) return;

        const token = tokens[tokenID];
        const previousToken = tokens[tokenID - 1];
        const nextToken = tokens[tokenID + 1];

        if (token.type != 'Punctuator' || token.value != '.') return;

        if (
            previousToken.loc.end.line == token.loc.start.line &&
            token.loc.start.line == nextToken.loc.start.line
        )
            return;

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
        console.log(this._store);
        return null;
    }
}
