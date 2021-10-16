import Extractor from './Extractor';
type buildType = 'json' | 'js' | 'yml';
export default class Core {
    public rules = new Extractor();
    private outFile: any = {
        extends: undefined,
        rules: {},
        env: undefined,
    };
    /**
     * Creates a eslintrc file in the specified format
     * @param type  The format of the output file
     */
    public build(type: buildType) {
        if (type == 'json') {
            return JSON.stringify(this.outFile, null, 4);
        }
    }
}
