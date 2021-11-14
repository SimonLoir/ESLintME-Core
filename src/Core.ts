import Extractor from './Extractor';
import BraceStyleRule from './rules/BraceStyleRule';
import CommaSpacingRule from './rules/CommaSpacingRule';
import DotLocationRule from './rules/DotLocationRule';
import EOLLastRule from './rules/EOLLastRule';
import FuncCallSpacingRule from './rules/FuncCallSpacing';
import IndentRule from './rules/Indent';
import Rule from './Rule';
import NoMixedSpacesAndTabs from './rules/NoMixedSpacesAndTabs';
type buildType = 'json' | 'js' | 'yml';
export default class Core {
    public static rules_list = [
        BraceStyleRule,
        CommaSpacingRule,
        DotLocationRule,
        EOLLastRule,
        FuncCallSpacingRule,
        IndentRule,
        NoMixedSpacesAndTabs,
    ];
    public rules = new Extractor();
    private outFile: any = {
        extends: [],
        rules: {},
        env: undefined,
    };
    private exceptions: {
        [key: string]: any;
    } = {};

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
        const exceptions = Object.keys(this.exceptions);

        // Adding values for the rules
        Object.keys(data).forEach((name) => {
            const d = data[name];

            if (!d) return;

            switch (name) {
                case EOLLastRule.esname:
                case FuncCallSpacingRule.esname:
                case DotLocationRule.esname:
                case IndentRule.esname:
                    rules[name] = ['error', d.value];
                    break;

                case CommaSpacingRule.esname:
                    rules[name] = ['error', d.options];
                    break;
            }
        });

        // Overriding the rules based on the exceptions provided
        exceptions.forEach((name) => {
            rules[name] = this.exceptions[name];
        });
    }

    /**
     * Overrides the value of a rule.
     * It can be used to disable an unwanted rule or change its value based on the project's needs
     * @param rulename The name of the eslint rule
     * @param newdata The value of the rule
     */
    public addRuleException(rulename: string, newdata: any) {
        console.assert(
            rulename && newdata,
            'A rulename and data associated must be provided'
        );
        this.exceptions[rulename] = newdata;
    }

    /**
     * Removes an exception for a specific rule
     * @param rulename The name of the eslint rule
     */
    public removeException(rulename: string) {
        console.assert(rulename, 'A rulename must be provided');
        if (this.exceptions[rulename]) delete this.exceptions[rulename];
        console.log(
            this.exceptions[rulename] == undefined,
            'Failed to remove the exception'
        );
    }

    /**
     * Extends the config file with a predefined set of rules :
     * eslint:recommended is a valid name
     * @param name the name of the set of rules
     */
    public extends(name: string) {
        console.assert(name, 'A name must be provided');
        if (this.outFile.extends.index(name) < 0)
            this.outFile.extends.push(name);
    }

    /**
     * Normalizes the value of a rule based on the rule's name
     * @param rulename The name of the rule that needs to be normalized
     * @param data The data that needs to be normalized
     * @throws Exception if the name of the rule does not exist
     */
    public normalize(rulename: string, data: any) {
        for (let i = 0; i < Core.rules_list.length; i++) {
            const r: typeof Rule = Core.rules_list[i];
            if (r.esname == rulename) return r.normalize(data);
        }
        throw 'The name of the rule is not a valid rule name';
    }
}
