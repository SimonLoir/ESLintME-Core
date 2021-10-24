declare interface RuleData {
    ruleName: string;
    value?: 'never' | 'always' | 'object' | 'property';
    options?: any;
}
declare type ExtractedRuleData = RuleData | null;
