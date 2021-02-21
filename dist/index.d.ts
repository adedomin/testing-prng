interface Choice {
    w: number;
    v: any;
}
/** Based on: http://burtleburtle.net/bob/rand/smallprng.html */
declare class PRNG {
    #private;
    static RAND_MAX: number;
    /**
     * Seeds and initializes the generator. default is 0x12345678
     */
    constructor(seed?: number);
    /**
     * @return a random int32 (may be negative).
     * use (x >>> 0) if you need positive numbers.
     */
    nextRand(): number;
    /**
     * Choose between a set of `choices`
     * choises are objects with a `{ w: number, v: any }` signature.
     * where `w` is expected to be a postive natural integer,
     * greater than 0, whole number
     * @return the randomly chosen choise
     */
    choose(choices: Choice[]): any;
    /**
     * Generates a random string using the generator given a specific length
     */
    getRandomAlphaNum(len?: number): string;
    /** Returns an iterator that will generate `count` numbers. */
    take(count: number): Generator<number, void, unknown>;
    /** Use `PRNG#take(number)` instead */
    [Symbol.iterator](count?: number): Generator<number, void, unknown>;
}
export { PRNG, Choice };
