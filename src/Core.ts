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

    private _exceptions: {
        [key: string]: any;
    } = {};

    private sets: {
        [name: string]: {
            [key: string]: any;
        };
    } = {};

    private ruleSetsOrder: OOListItem[] = [];

    public get exceptions(): {
        [key: string]: any;
    } {
        return { ...this._exceptions };
    }

    private _env: { [key: string]: boolean } = {};

    /**
     * Returns the environnement used in the eslint config.
     */
    get env() {
        return { ...this._env };
    }

    /**
     * Sets the new environnement for the eslint config.
     */
    set env(env: { [key: string]: boolean }) {
        console.assert(env, 'No environnement provided');
        this._env = env;
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
     * Gets the list of rules based on the data extracted from the files
     * and the sets of rules provided.
     * @returns A key-value object containing the rules and their values.
     */
    public getRules() {
        const extracted = this.extractRules();
        console.group();
        const rules: any = {};

        if (this.ruleSetsOrder.length == 0) return extracted;

        this.ruleSetsOrder.forEach((set) => {
            if (!set.enabled) return console.log('ignored ', set);
            if (set.id == 'None' || !set.id)
                return console.log('ignored ', set);

            const found_set = this.sets[set.id];

            if (!found_set && set.id != 'found')
                return console.error(`Set ${set.id} could not be located`);

            let to_merge = found_set ?? extracted;

            Object.keys(to_merge).forEach((key) => {
                if (rules[key] && !set.force) return;
                rules[key] = to_merge[key];
            });
        });
        console.groupEnd();
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

        const content = { env: this._env, rules };

        switch (format) {
            case 'js':
                return `module.exports = ${JSON.stringify(content, null, 2)}`;
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
        console.assert(order != undefined, 'The order list must be provided');
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

        console.info('Storing the new set', set_name, 'as', set);
        this.sets[set_name] = set;
    }

    /**
     * Extracts all options from a rule.
     * @returns The options found for each rule.
     */
    public getAllOptions() {
        return this.rules.extractAllOptions();
    }
}
