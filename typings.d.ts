declare module 'espree' {
    export interface Options {
        range?: boolean;
        loc?: boolean;
        comment?: boolean;
        tokens?: boolean;
        ecmaVersion?:
            | 3
            | 5
            | 6
            | 7
            | 8
            | 9
            | 10
            | 11
            | 12
            | 2015
            | 2016
            | 2017
            | 2018
            | 2019
            | 2021
            | 2022
            | 'latest';
        sourceType?: 'script' | 'module';
        ecmaFeatures?: {
            jsx?: boolean;
            globalReturn?: boolean;
            impliedStrict?: boolean;
        };
    }

    export interface Program {
        body: any;
        end: number;
        start: number;
        range: number[];
        sourceType: 'script' | 'module';
        type: 'Program';
        tokens: Token[];
        loc: SourceLocation;
    }

    export type TokenType = 'Identifier' | 'Punctuator' | 'String';
    export interface Token {
        type: TokenType;
        loc: SourceLocation;
        start: number;
        end: number;
        range: number[];
    }

    export interface SourceLocation {
        start: Position;
        end: Position;
    }

    export interface Position {
        line: number;
        column: number;
    }

    export function parse(code: string, options?: Options): Program;
}
