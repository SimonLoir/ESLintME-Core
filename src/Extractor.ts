import * as esprima from 'esprima';
export default class Extractor {
    public parse(filename: string, content: string) {
        return esprima.tokenize(content, {
            range: true,
            loc: true,
        });
    }
}
