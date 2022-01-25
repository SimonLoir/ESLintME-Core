import Rule from '../Rule';
import * as espree from 'espree';

type QuoteType = "'" | '"' | '`';
type QuotesSet = Set<QuoteType>;
interface QuotesData {
    type: string;
    escaped: boolean;
    quotesInside: QuotesSet;
}

export default class QuotesRule extends Rule<QuotesData> {
    public static esname = 'quotes';

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
            token.type == 'String',
            'Incorrect token type, String expected'
        );

        const type = token.value[0];

        this.store(filename + ':' + tokenID, {
            type,
            escaped: token.value.indexOf('\\' + type) >= 0,
            quotesInside: this.otherQuotesInside(type, token.value),
        });

        console.log(this._store);
    }

    private otherQuotesInside(type: string, str: string) {
        const types: QuoteType[] = ["'", '"', '`'];
        const set: QuotesSet = new Set();
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char != type && types.includes(char as QuoteType))
                set.add(char as QuoteType);
        }
        return set;
    }
}
