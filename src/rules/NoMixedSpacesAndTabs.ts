import Rule from '../Rule';
import * as espree from 'espree';

export default class NoMixedSpacesAndTabs extends Rule<boolean | 'smart-tabs'> {
    public static esname = 'no-mixed-spaces-and-tabs';

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

        spaces.forEach((space, i) => {
            const f = filename + ':' + i;
            if (space.indexOf('\t') >= 0) {
                if (space.indexOf(' ') >= 0) {
                    // Mixed spaces and tabs
                    const spaces_left = space.replaceAll('\t', '');
                    if (spaces_left.length == 4 || spaces_left.length == 5)
                        this.store(f, 'smart-tabs');
                    else this.store(f, false);
                } else this.store(f, true);
            }
        });
    }

    public extract() {
        // TODO: work in progress - this rule is not implemented yet.
        return null;
    }

    public static normalize(data: any) {
        return Rule.normalize(data);
    }
}
