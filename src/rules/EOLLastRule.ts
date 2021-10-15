import Rule from '@core/Rule';
import * as esprima from 'esprima';

/* Rule representing the EOLLast rule in ESLint*/
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

        // Comparing the last char with the new line char
        this.store(filename, lastChar == '\n' || lastChar == '\r');

        console.assert(this.inStore(filename));
    }

    public extract() {
        let result: RuleData | null = null;
        // Checks if all files end with a new line
        if (this.all((_, e) => e == true))
            result = { ruleName: 'eol-last', value: 'always' };
        // Checks if all files end without a new line
        else if (this.all((_, e) => e == false))
            result = { ruleName: 'eol-last', value: 'never' };
        return result;
    }
}
