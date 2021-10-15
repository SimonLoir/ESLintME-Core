import * as esprima from 'esprima';

interface Store<T> {
    [key: string]: T;
}
export default class Rule<T> {
    public static esname: string = 'rule';
    private _store: Store<T> = {};

    /**
     * Performs a test on the entire program
     * @param filename The name of the script file
     * @param program The Program parsed by esprima
     * @param content The content of the file
     */
    public testFile(
        filename: string,
        program: esprima.Program,
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
        program: esprima.Program,
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
}
