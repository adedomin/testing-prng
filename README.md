Testing PRNG
============

Deterministic [Jenkins](http://burtleburtle.net/bob/rand/smallprng.html) 32bit PRNG implementation with helpful methods for testing.

### Using

```javascript
const { PRNG } = require('testing-prng');

const prng = new PRNG(/* default seed is 0x12345678 */);

// Generate alphanumeric string
console.log(prng.getRandomAlphaNum(10));

// Choose from a set of weighted values
const choices = [
    { w: 1, v: 0 },
    { w: 3, v: 1 },
    { w: 2, v: 2 },
    { w: 4, v: 3 },
];

const occ = [ 0, 0, 0, 0 ];

for (let i = 0; i < 1_000_000; ++i)
{
    // should be evenly distributed by weight
    occ[prng.choose(choices)]++;
}

// roughly [ 100_000, 300_000, 200_000, 400_000 ]
console.log(occ);
```

### Packaging

Due to unique issues with Yarn, dist is checked in.
