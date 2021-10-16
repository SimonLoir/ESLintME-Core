import Extractor from './Extractor';
import EOLLastRule from './rules/EOLLastRule';
import FuncCallSpacingRule from './rules/FuncCallSpacing';
type buildType = 'json' | 'js' | 'yml';
export default class Core {
    public rules = new Extractor();
    private outFile: any = {
        extends: undefined,
        rules: {},
        env: undefined,
    };

    /**
     * Creates a eslintrc file in the specified format
     * @param type  The format of the output file
     */
    public build(type: buildType) {
        this.populateRules();
        if (type == 'json') {
            return JSON.stringify(this.outFile, null, 4);
        }
    }

    /**
     * Creates a new entry for each rule that matches a test pattern
     */
    public populateRules() {
        this.outFile['rules'] = {};
        const rules = this.outFile['rules'];
        const data = this.rules.extract();
        [EOLLastRule.esname, FuncCallSpacingRule.esname].forEach((name) => {
            const d = data[name];
            if (!d) return;

            switch (name) {
                case EOLLastRule.esname:
                    rules[name] = ['error', d.value];
                    break;

                case FuncCallSpacingRule.esname:
                    rules[name] = ['error', d.value];
                    break;
            }
        });
    }
}
