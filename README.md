# Iron Test

A testing framework for TypeScript made specifically for tests that need to be run in a particular order.

Roughly inspired by TestNG.

## Usage

### Defining Tests and Assertions

```typescript
import { TestClass, Test, Asserts, Assert } from "irontest";

@TestClass()
export class TestClass1 {
    @Test()
    public static firstTest(
        @Asserts() assert: Assert,
    ) {
        assert.equal(42, 42);
    }
}
```

### Using async tests

```typescript
import { TestClass, Test, Asserts, Assert } from "irontest";
import { resolve, map } from "fluture";

@TestClass()
export class TestClass1 {
    @Test()
    public static returnPromise(
        @Asserts() assert: Assert,
    ): Promise<boolean> {
        return Promise
            .resolve(42)
            .then(val => assert.equal(42, val))
            .then(() => true);
    }

    @Test()
    public static returnFuture(
        @Asserts() assert: Assert,
    ): Promise<boolean> {
        const val = (resolve (42));
        const checkVal = val => assert.equal(42, 42);
        return (map (checkVal) (val));
    }

    /**
     * Without `@TestReturnsAsync()`, any test depending on `outputPromise` would get the value '42'.
     *
     * With `@TestReturnsAsync()`, any test depending on `outputPromise` will get 'Promise<42>'.
     */
    @Test()
    @TestReturnsAsync()
    public static outputPromise() {
        return Promise.resolve(42);
    }
}
```

### Other Options

#### Test Timeouts

Set the maximum duration for a test (defaults to 500ms):

```typescript
import { TestClass, Test, TestTimeout } from "irontest";

@TestClass()
class Tests {
    @Test()
    @TestTimeout(1000)
    public static testWithTimeout() {
        return new Promise((resolve, reject) => {
            // This will fail the test due to the timeout:
            setTimeout(() => resolve(), 2000);
        })
    }
}
```

### Running

```typescript
import { IronTest } from "irontest";

import { TestClass1 } from "./testClass1";
import { TestClass2 } from "./testClass2";
import { TestClass3 } from "./testClass3";

const runner = new IronTest();
runner.add([
    TestClass1,
    TestClass2.firstTest,
    TestClass2.secondTest,
    TestClass3.cleanup,
]);
runner.run();
```

## Limitations

### Limitation: Parallelization

There's many great options for running tests in parallel, like AVA.
This is not one of those.  Iron Test specializes in interdependent tests,
like complex flows in integration tests.

### Limitation: Single Runtime Environment

You can't run the same tests (or tests with common dependencies) in different runs at the same time, in the same process.

```typescript
// Supported: Single run
await new IronTest().add([ TestClass1 ]).run().promise();

// Supported: Two test groups with no common dependencies in parallel
await new IronTest().add([ TestClass1 ]).run().promise();
await new IronTest().add([ TestClass2 ]).run().promise();

// Supported: Re-running tests after first run finishes
await new IronTest().add([ TestClass1 ]).run().promise();
await new IronTest().add([ TestClass1 ]).run().promise();

// NOT SUPPORTED: running the same test in parallel
import { parallel } from "fluture";
const run1 = new IronTest().add([ TestClass1 ]).run();
const run2 = new IronTest().add([ TestClass1 ]).run();
const NOT_SUPPORTED = parallel (2, [ run1, run2 ]).promise();
```

### Limitation: Don't export 'TestClass'

`TestClass` (the annotation used to mark classes containing tests)
uses some... interesting... methods to get the path to the current test file.

Long story short, it depends on being directly imported in your test file:

```typescript
// In `test/RobotController/no-robot-domination.ts`:
import { TestClass } from "irontest"; // or:
import { TestClass } from "irontest/dist/src/decorators"; // or:
import { TestClass } from "irontest/dist/src/decorators/TestClass";

@TestClass()
class NoRobotDomination {
    @Test()
    public static robotKillsNobody() { /* ... */ }
}

// DON'T DO THIS:

// In `test/helpers/this-wont-work.ts`:
export { TestClass } from "irontest";
// In `test/RobotController/maybe-robot-domination.ts`:
import { TestClass } from "../helpers/this-wont-work.ts";
// Now any tests will be marked as being inside 'this-wont-work.ts'
// instead of 'maybe-robot-domination.ts'.
```
