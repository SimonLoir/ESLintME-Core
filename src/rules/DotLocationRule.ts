import Rule from '../Rule';
import * as espree from 'espree';

export default class DotLocationRule extends Rule<any> {
    public static esname = 'dot-location';

    public testForToken(
        filename: string,
        program: espree.Program,
        content: string,
        tokenID: number
    ) {}

    public extract() {
        return null;
    }
}
