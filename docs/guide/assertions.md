---
uid: guide-assertions
---
# Assertion Methods

## .equal()

Use `.equal()` for basic equality tests.

```
equal<T>(actual: T, expected: T, message: string)
```

TODO: Link to Assert.equal

## .log()

Use `.log()` to output messages inside a test - using `console.log()` would interrupt the TAP output,
so `.log()` will make sure that the logged message is outputted according to the TAP protocol.

TODO: Link to Assert.log

TODO: Include other assertion methods
