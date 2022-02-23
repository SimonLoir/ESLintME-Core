import * as espree from 'espree';

interface Store<T> {
    [key: string]: T;
}
export default class Rule<T> {
    public static esname: string = 'rule';
    protected _store: Store<T> = {};

    /**
     * Performs a test on the entire program
     * @param filename The name of the script file
     * @param program The Program parsed by esprima
     * @param content The content of the file
     */
    public testFile(
        filename: string,
        program: espree.Program,
        content: string
    ) {
        throw (
            'Not implemented : testFile is not available in ' +
            this.constructor.name
        );
    }

    /**
     * Performs a test on a specific token
     * @param filename The name of the script file
     * @param program The Program parsed by esprima
     * @param content The content of the file
     * @param tokenID The index of the token
     */
    public testForToken(
        filename: string,
        program: espree.Program,
        content: string,
        tokenID: number
    ) {
        throw (
            'Not implemented : testForToken is not available in ' +
            this.constructor.name
        );
    }

    /**
     * Extracts the rule from the observations.
     * @returns the rule's data if a pattern was found,
     *          null otherwise
     */
    public extract(): ExtractedRuleData {
        throw 'You must override the extract method';
    }

    /**
     * Stores a test result for a file
     * @param name The name of the test
     * @param value The result of the test
     */
    public store(name: string, value: T) {
        this._store[name] = value;
    }

    /**
     * Lists tests stored
     * @returns A list of the test names in the store
     */
    public getStoredKeys() {
        return Object.keys(this._store);
    }

    /**
     * Tells if an test is already in the store
     * @param name The name of the test in the store
     * @returns Whether the test exists in the store or not.
     */
    public inStore(name: string) {
        return name in this._store;
    }

    /**
     * Fetches a test result in the store based on its name
     * @param name The name of the test in the store
     * @returns
     */
    public get(name: string) {
        return this._store[name];
    }

    /**
     * Checks if all the tests follow the same pattern defined in the callback.
     * @param check The function used to process the test result and compare it to the others.
     * @returns Whether or not all the tests follow the pattern
     */
    public all(check: (name: string, test: T) => boolean) {
        const keys = this.getStoredKeys();

        if (keys.length == 0) return false;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (!check(key, this._store[key])) return false;
        }
        return true;
    }

    /**
     * Counts the number of tests that follow the pattern defined in the callback
     * @param check The function used to process the test result
     * @returns The number of tests that follow the pattern
     */
    public count(check: (name: string, test: T) => boolean) {
        let count = 0;
        this.getStoredKeys().forEach((key) => {
            if (check(key, this._store[key])) count++;
        });
        return count;
    }

    /**
     * Counts the number of tests stored.
     * @returns The number of items stored
     */
    public get length() {
        return this.getStoredKeys().length;
    }

    /**
     * Tells wether all the tests returned the same result
     * @returns true if all the tests returned the same result
     *          false otherwise or if there is no test in store
     */
    public allSame() {
        if (this.length == 0) return false;
        let first = this._store[this.getStoredKeys()[0]];
        console.log(first, this._store);
        return this.all((_, elem) => elem == first);
    }

    /**
     * Gets all the possible options found for this rule
     * The extract method only gives a result if the probability is 100% but
     * this method gives all the options.
     * @returns An array of possible options
     */
    public getAllOptions(): RuleData[] {
        console.warn('getAllOptions not implemented, returned []');
        return [];
    }

    /**
     * Normalizes the value of the rule.
     * Removes the default values.
     * @param data The data that needs to be normalized
     * @returns The normalized value of the rule
     */
    public static normalize(data: any) {
        if (data == 'off') data = 0;
        if (data == 'warn') data = 1;
        if (data == 'error') data = 2;

        if (typeof data == 'number') data = [data];

        if (Array.isArray(data)) {
            if (data.length == 0) data = [0];

            if (data[0] == 'off') data[0] = 0;
            if (data[0] == 'warn') data[0] = 1;
            if (data[0] == 'error') data[0] = 2;

            if (data[0] == 0) data = [0];
        }

        return data;
    }
}
