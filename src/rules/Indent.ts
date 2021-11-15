import Rule from '../Rule';
import * as espree from 'espree';

export default class IndentRule extends Rule<any> {
    public static esname = 'indent';

    public testFile(
        filename: string,
        program: espree.Program,
        content: string
    ) {
        console.assert(filename, 'Filename must be given');
        console.assert(program, 'Program must be given');
        console.assert(content, 'The content of the file must be given');

        const lines = content.split(/\r?\n/);

        // We get a list of the spaces before each line
        const spaces = lines.map((line) => line.replace(line.trimStart(), ''));

        let model: string = '';

        for (let i = 0; i < spaces.length; i++) {
            const space = spaces[i];
            if (i > 0) {
                const previous_space = spaces[i - 1];
                if (previous_space == '' && space != '') {
                    // In this case we have
                    if (model == '') model = space;
                }

                if (
                    space != '' &&
                    // Protection against empty lines and comments lines
                    lines[i].trim() != '' &&
                    !lines[i].trimStart().startsWith('*') &&
                    !lines[i].trimStart().startsWith('/')
                ) {
                    let model_type;
                    if (
                        space.replaceAll(model, '') == '' &&
                        space.length % model.length == 0
                    ) {
                        // Correct amount of spaces or tabs
                        model_type = model == '\t' ? 'tab' : model.length;
                    } else {
                        // Mixed content
                        model_type =
                            model == '\t'
                                ? 'tab'
                                : space.replaceAll(model, '').length;
                    }

                    this.store(filename + ':' + i, model_type);
                }
            }
        }
    }

    public extract() {
        let result: ExtractedRuleData | null = null;
        if (this.allSame()) {
            console.log('same');
            result = {
                ruleName: IndentRule.esname,
                value: this._store[this.getStoredKeys()[0]],
            };
            return result;
        }
        return result;
    }

    public static normalize(data: any) {
        return data;
    }
}
