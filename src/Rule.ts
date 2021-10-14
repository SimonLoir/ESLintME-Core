export default class Rule {
    public test(fileAST: any[]) {}

    /**
     * Extracts the rule from the observations.
     * @returns the rule's data if a pattern was found,
     *          null otherwise
     */
    public extract(): ExtractedRuleData {
        throw 'You must override the extract method';
    }
}
