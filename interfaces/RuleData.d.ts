declare interface RuleData {
    ruleName: string;
    value: 'never' | 'always';
}
declare type ExtractedRuleData = RuleData | null;
