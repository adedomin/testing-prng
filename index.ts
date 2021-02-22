// Copyright (C) 2021  Anthony DeDominic <adedomin@gmail.com>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

interface Choice
{
    w: number, /* weight, must be greater than zero */
    v: any,
}

/** Based on: http://burtleburtle.net/bob/rand/smallprng.html */
class PRNG
{
    #a;
    #b;
    #c;
    #d;

    static RAND_MAX = 2**32 - 1;

    /**
     * Seeds and initializes the generator. default is 0x12345678
     */
    constructor(seed: number = 0x12345678)
    {
        this.#a = 0xf1ea5eed;
        this.#b = seed;
        this.#c = seed;
        this.#d = seed;
        // init generator
        for (let i = 0; i < 20; ++i) this.nextRand();
    }

    /** 
     * @return a random int32 (may be negative).
     * use (x >>> 0) if you need positive numbers.
     */
    nextRand()
    {
        const a = this.#a | 0;
        const b = this.#b | 0;
        const c = this.#c | 0;
        const d = this.#d | 0;
        const e = a - ((b << 27) | (b >> 5))  | 0;
        this.#a = b ^ ((c << 17) | (b >> 15)) | 0;
        this.#b = c + d       | 0; // Should overflow correctly
        this.#c = d + e       | 0;
        this.#d = e + this.#a | 0;
        return this.#d        | 0;
    }

    /**
     * Choose between a set of `choices`
     * choises are objects with a `{ w: number, v: any }` signature.
     * where `w` is expected to be a postive natural integer with a maxium value of 2**31-1,
     * greater than 0, whole number
     * @return the randomly chosen choise
     */
    choose(choices: Choice[]): any
    {
        if (choices.length < 1) return undefined; // nothing to choose
        const max = choices.reduce((acc, { w }) => acc + w | 0, 0);
        if (max < 0) throw new RangeError(`Sum of Choice[].w should be positive; got: ${max}`);

        // Account for modulo bias
        let pick: number;
        do {
            // random has to be positive
            // >>> = unsigned
            pick = (this.nextRand()>>>0);
        } while(pick >= (PRNG.RAND_MAX - PRNG.RAND_MAX % max));

        pick %= max;

        let acc = 0;
        return choices.find(({ w }) => {
            if (pick >= acc && pick < (acc + w | 0)) return true;
            acc = acc + w | 0;
            return false;
        })?.v;
    }

    /**
     * Generates a random string using the generator given a specific length
     */
    getRandomAlphaNum(len?: number)
    {
        // 64 chars (not base64)
        const values = '-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return [ ...this.take(len ?? 8) ]
            .map((v: number) => values.charAt((v>>>0) % values.length))
            .join('');

    }

    /** Returns an iterator that will generate `count` numbers. */
    take(count: number)
    {
        return this[Symbol.iterator](count);
    }

    /** Use `PRNG#take(number)` instead */
    *[Symbol.iterator](count: number = 1)
    {
        for (let i = 0; i < count; ++i) yield this.nextRand();
    }
}

export { PRNG, Choice };
