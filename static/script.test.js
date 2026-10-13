/**
 * Client-Side Bijective Base-6 Unit Tests
 * Can be run directly via `node static/script.test.js`
 */

const assert = require('assert');

const toBijective = (n) => {
    if (n === null || n === undefined || isNaN(n) || n <= 0) return "(N/A)";
    const chars = "123456";
    let result = '';
    let val = Math.floor(n);
    while (val > 0) {
        result = chars[(val - 1) % 6] + result;
        val = Math.floor((val - 1) / 6);
    }
    return result;
};

const fromBijective = (s) => {
    if (!s || typeof s !== 'string') throw new Error("Input cannot be empty.");
    const clean = s.trim();
    if (!/^[1-6]+$/.test(clean)) {
        throw new Error("Invalid bijective base-6 number. Digits must be strictly 1 to 6 (no zero).");
    }
    let n = 0;
    for (let char of clean) {
        n = n * 6 + parseInt(char, 10);
    }
    return n;
};

function runTests() {
    console.log("Running Client-Side Bijective Unit Tests...");

    // Test toBijective
    assert.strictEqual(toBijective(1), "1");
    assert.strictEqual(toBijective(6), "6");
    assert.strictEqual(toBijective(7), "11");
    assert.strictEqual(toBijective(12), "16");
    assert.strictEqual(toBijective(36), "56");
    assert.strictEqual(toBijective(42), "66");
    assert.strictEqual(toBijective(43), "111");
    assert.strictEqual(toBijective(216), "556");

    // Test fromBijective
    assert.strictEqual(fromBijective("1"), 1);
    assert.strictEqual(fromBijective("6"), 6);
    assert.strictEqual(fromBijective("11"), 7);
    assert.strictEqual(fromBijective("16"), 12);
    assert.strictEqual(fromBijective("56"), 36);
    assert.strictEqual(fromBijective("66"), 42);
    assert.strictEqual(fromBijective("111"), 43);
    assert.strictEqual(fromBijective("556"), 216);

    // Roundtrip tests 1 to 1000
    for (let i = 1; i <= 1000; i++) {
        const bij = toBijective(i);
        const dec = fromBijective(bij);
        assert.strictEqual(dec, i, `Mismatch at decimal ${i}: bijective was ${bij}`);
    }

    // Invalid input tests
    assert.throws(() => fromBijective("0"), /Invalid bijective base-6/);
    assert.throws(() => fromBijective("10"), /Invalid bijective base-6/);
    assert.throws(() => fromBijective("17"), /Invalid bijective base-6/);
    assert.throws(() => fromBijective("abc"), /Invalid bijective base-6/);

    console.log("✓ All 1,012 test assertions passed successfully!");
}

if (typeof describe === 'function') {
    describe('Bijective Base-6 Client Logic', () => {
        test('runs all conversions and roundtrips', () => {
            runTests();
        });
    });
} else {
    runTests();
}