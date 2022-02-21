import Extractor from './Extractor';
import BraceStyleRule from './rules/BraceStyleRule';
import CommaSpacingRule from './rules/CommaSpacingRule';
import DotLocationRule from './rules/DotLocationRule';
import EOLLastRule from './rules/EOLLastRule';
import FuncCallSpacingRule from './rules/FuncCallSpacing';
import IndentRule from './rules/Indent';
import Rule from './Rule';
import NoMixedSpacesAndTabs from './rules/NoMixedSpacesAndTabs';
import NoVarRule from './rules/NoVarRule';
import NoDebuggerRule from './rules/NoDebuggerRule';
import * as yaml from 'js-yaml';
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
        NoVarRule,
        NoDebuggerRule,
    ];

    public rules = new Extractor();

    private outFile: any = {
        extends: [],
        rules: {},
        env: undefined,
    };

    private _exceptions: {
        [key: string]: any;
    } = {};

    private sets: {
        [name: string]: {
            [key: string]: any;
        };
    } = {};

    private ruleCustomLevels: {
        [key: string]: 0 | 1 | 2;
    } = {};

    private ruleSetsOrder: OOListItem[] = [];

    public get exceptions(): {
        [key: string]: any;
    } {
        return { ...this._exceptions };
    }

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
        this.outFile['rules'] = this.extractRules();
        const rules = this.outFile['rules'];
        const exceptions = Object.keys(this._exceptions);

        // Overriding the rules based on the exceptions provided
        exceptions.forEach((name) => {
            rules[name] = this._exceptions[name];
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
        this._exceptions[rulename] = newdata;
    }

    /**
     * Removes an exception for a specific rule
     * @param rulename The name of the eslint rule
     */
    public removeException(rulename: string) {
        console.assert(rulename, 'A rulename must be provided');
        if (this._exceptions[rulename]) delete this._exceptions[rulename];
        console.assert(
            this._exceptions[rulename] == undefined,
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
        console.assert(rulename, 'You should provide a rule name');
        console.assert(data, 'No data to normalize');
        return Core.getRule(rulename).normalize(data);
    }

    /**
     * Gets a rule by its name
     * @param rulename The name of the rule
     * @returns The rule
     */
    public static getRule(rulename: string): typeof Rule {
        console.assert(rulename, 'You should provided a rule name');
        for (let i = 0; i < Core.rules_list.length; i++) {
            const r: typeof Rule = Core.rules_list[i];
            if (r.esname == rulename) return r;
        }
        throw new Error('The rule could not be found');
    }

    /**
     * Extract all the rules found in the js files
     * @returns A dictionary of the rules found with the rulename as a key.
     */
    public extractRules() {
        const data = this.rules.extract();
        const rules: any = {};
        // Adding values for the rules
        Object.keys(data).forEach((name) => {
            const d = data[name];

            if (!d) return;

            switch (name) {
                case EOLLastRule.esname:
                case FuncCallSpacingRule.esname:
                case DotLocationRule.esname:
                case IndentRule.esname:
                    rules[name] = [2, d.value];
                    break;

                case NoVarRule.esname:
                case NoDebuggerRule.esname:
                    rules[name] = [2];
                    break;

                case CommaSpacingRule.esname:
                    rules[name] = [2, d.options];
                    break;
            }
        });
        return rules;
    }

    /**
     * Sets the new level of a rule.
     * 0 -> ignore
     * 1 -> warning
     * 2 -> error
     * Overrides the default level (2) for a specific rule.
     * @param rulename The name of the rule
     * @param level The new rule level
     */
    public setRuleLevel(rulename: string, level: 0 | 1 | 2) {
        console.assert(rulename, 'Rule name should be provided');
        console.assert(
            level && level > -1 && level < 3,
            'Incorrect rule level'
        );
        this.ruleCustomLevels[rulename] = level;
    }

    public getRules() {
        console.log('get rules called');
        const extracted = this.extractRules();
        const rules: any = {};

        if (this.ruleSetsOrder.length == 0) return extracted;

        this.ruleSetsOrder.reverse().forEach((set) => {
            if (!set.enabled) return;
            if (set.id == 'None' || !set.id) return;

            const found_set = this.sets[set.id];

            if (!found_set && set.id != 'found')
                return console.log(`Set ${set.id} could not be located`);

            let to_merge = found_set ?? extracted;

            Object.keys(to_merge).forEach((key) => {
                if (rules[key] && !set.force) return;
                rules[key] = to_merge[key];
            });
        });

        return rules;
    }

    /**
     * Exports the new config file based on the format
     * @param format The format of the requested config file
     * @returns The contents of the new config file
     */
    public export(format: buildType): string {
        console.assert(format, 'Incorrect format type provided');
        const rules = this.getRules();

        Object.keys(this._exceptions).forEach((key) => {
            rules[key] = this._exceptions[key];
        });

        const content = { rules };

        switch (format) {
            case 'js':
                return '';
            case 'json':
                return JSON.stringify(content, null, 2);
            case 'yml':
                return yaml.dump(content);
        }
    }

    /**
     * Sets the order in which the sets of rules must be used
     * @param order A list of items representing the different set of rules that can be used in the program
     */
    public setRulesOrder(order: OOListItem[]) {
        console.assert(
            order && order.length > 0,
            'The order list must be provided'
        );
        console.log('New rules order : ', order);
        this.ruleSetsOrder = order;
    }

    /**
     * Stores a new set of rules identified by a name.
     * @param set_name The name of the set of rules
     * @param set The set of rules itself
     */
    public setNamedRuleset(set_name: string, set: { [key: string]: any }) {
        console.assert(
            set_name,
            'The name of the set of rules must be provided'
        );
        console.assert(set, 'The set of rules must be provided');

        console.log('Storing the new set', set_name, 'as', set);
        this.sets[set_name] = set;
    }
}
