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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRNG = void 0;
/** Based on: http://burtleburtle.net/bob/rand/smallprng.html */
class PRNG {
    /**
     * Seeds and initializes the generator. default is 0x12345678
     */
    constructor(seed = 0x12345678) {
        _a.set(this, void 0);
        _b.set(this, void 0);
        _c.set(this, void 0);
        _d.set(this, void 0);
        __classPrivateFieldSet(this, _a, 0xf1ea5eed);
        __classPrivateFieldSet(this, _b, seed);
        __classPrivateFieldSet(this, _c, seed);
        __classPrivateFieldSet(this, _d, seed);
        // init generator
        for (let i = 0; i < 20; ++i)
            this.nextRand();
    }
    /**
     * @return a random int32 (may be negative).
     * use (x >>> 0) if you need positive numbers.
     */
    nextRand() {
        const a = __classPrivateFieldGet(this, _a) | 0;
        const b = __classPrivateFieldGet(this, _b) | 0;
        const c = __classPrivateFieldGet(this, _c) | 0;
        const d = __classPrivateFieldGet(this, _d) | 0;
        const e = a - ((b << 27) | (b >> 5)) | 0;
        __classPrivateFieldSet(this, _a, b ^ ((c << 17) | (b >> 15)) | 0);
        __classPrivateFieldSet(this, _b, c + d | 0); // Should overflow correctly
        __classPrivateFieldSet(// Should overflow correctly
        this, _c, d + e | 0);
        __classPrivateFieldSet(this, _d, e + __classPrivateFieldGet(this, _a) | 0);
        return __classPrivateFieldGet(this, _d) | 0;
    }
    /**
     * Choose between a set of `choices`
     * choises are objects with a `{ w: number, v: any }` signature.
     * where `w` is expected to be a postive natural integer,
     * greater than 0, whole number
     * @return the randomly chosen choise
     */
    choose(choices) {
        if (choices.length < 1)
            throw new Error('Choices must contain at least 1 choice.');
        const max = choices.reduce((acc, { w }) => acc + (w | 0), 0);
        // Account for modulo bias
        let pick;
        do {
            // random has to be positive;
            // >>> = unsigned
            pick = (this.nextRand() >>> 0);
        } while (pick >= (PRNG.RAND_MAX - PRNG.RAND_MAX % max));
        pick %= max;
        let acc = 0;
        return choices.find(({ w }) => {
            if (pick >= acc && pick < (acc + (w | 0)))
                return true;
            acc += (w | 0);
            return false;
        })?.v;
    }
    /**
     * Generates a random string using the generator given a specific length
     */
    getRandomAlphaNum(len) {
        // 64 chars (not base64)
        const values = '-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return [...this.take(len ?? 8)]
            .map(v => values.charAt((v >>> 0) % values.length))
            .join('');
    }
    /** Returns an iterator that will generate `count` numbers. */
    take(count) {
        return this[Symbol.iterator](count);
    }
    /** Use `PRNG#take(number)` instead */
    *[(_a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _d = new WeakMap(), Symbol.iterator)](count = 1) {
        for (let i = 0; i < count; ++i)
            yield this.nextRand();
    }
}
exports.PRNG = PRNG;
PRNG.RAND_MAX = 2 ** 32 - 1;
