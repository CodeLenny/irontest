---
uid: guide-flags
---
# TODO, Skip, and Other Flags

## Exclusive Flags

These flags can't be used together.
Flags are listed in priority: the first flags on this page will override flags listed later.
For instance, a test marked with both `@SkipTest` and `@BypassTest` will be skipped, instead of bypassed.

### Skip Tests

### Bypass Tests

If you want to skip a test, but it's involved in a long test chain,
you can use `@BypassTest` to supply a default value to any functions that depend on the output.

```typescript
import { TestClass, Test, BypassTest, TestOutput } from "irontest";

@TestClass()
export class BypassedTest {

    @Test()
    @TestTODO("Fix getUserDetails() and remove @BypassTest")
    @BypassTest(new User())
    public static getUser() {
        // API may be failing:
        return myApi.getUserDetails();
    }

    @Test()
    public static doSomething(
        @Asserts() assert: Assert,
        @TestOutput(BypassedTest.getUser) user: User,
    ) {
        // user will be `new User()` from `@BypassTest` call:
        assert.true(user.isUser());
    }

}
```

## Non-Exclusive Flags

These flags can be used with other flags, unlike the ones in the previous section.

## Mark as TODO

## Allow Test to Fail
