import Rule from '@core/Rule';
import * as esprima from 'esprima';

export default class EOLLastRule extends Rule<boolean> {
    public testFile(
        filename: string,
        program: esprima.Program,
        content: string
    ) {
        console.assert(filename != null);
        console.assert(program != null);
        console.assert(content != null);

        const lastChar = content.charAt(content.length - 1);

        this.store(filename, lastChar == '\n' || lastChar == '\r');

        console.assert(this.inStore(filename));
    }

    public extract() {
        return null;
    }
}
