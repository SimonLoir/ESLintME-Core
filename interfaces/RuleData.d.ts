declare interface RuleData {
    ruleName: string;
    value?: 'never' | 'always' | 'object' | 'property';
    options?: any;
    noValue?: boolean;
}
declare type ExtractedRuleData = RuleData | null;
