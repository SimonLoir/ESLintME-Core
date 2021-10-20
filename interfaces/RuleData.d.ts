declare interface RuleData {
    ruleName: string;
    value?: 'never' | 'always';
    options?: any;
}
declare type ExtractedRuleData = RuleData | null;
