import Rule from '../Rule';
import * as espree from 'espree';

/* Rule representing the EOLLast rule in ESLint*/
export default class EOLLastRule extends Rule<boolean> {
    public static esname = 'esol-last';

    public testFile(
        filename: string,
        program: espree.Program,
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
            result = { ruleName: EOLLastRule.esname, value: 'always' };
        // Checks if all files end without a new line
        else if (this.all((_, e) => e == false))
            result = { ruleName: EOLLastRule.esname, value: 'never' };
        // At this point, it is impossible to find a pattern
        return result;
    }
}
