---
uid: guide-define-tests
---
# Defining Tests and Assertions

Test files using Iron Test need to use the `@TestClass()` and `@Test()` annotations
on test classes and test methods, respectively.

> [!WARNING]
> Don't re-export `@TestClass()`.
> It uses some... interesting... methods to get the path to the current test file.
> Long story short, it depends on being directly imported in your test file.

```typescript
import { TestClass, Test } from "irontest";

@TestClass()
export class MyTests {

    @Test()
    public static basicTest() {
        // ...
    }

}
```

All tests must be static methods marked with `@Test()`, in classes marked with `@TestClass()`,
otherwise the test runner can't find tests and link them together.

## Assertions

Inject assertions into a test with the `@Asserts()` annotation:

```typescript
import { TestClass, Test, Asserts, Assert } from "irontest";

@TestClass()
export class MathTests {

    @Test()
    public static additionTest(
        @Asserts() assert: Assert,
    ) {
        assert.equal(1 + 2, 3);
        assert.equal(10 + 10, 20, "10 + 10 should equal 20");
    }

}
```
