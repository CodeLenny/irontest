import { TestClass, Test, Asserts, Assert, IronTest } from "../../../../src";

@TestClass()
export class MultipleAssertions {

  @Test()
  public static testWithMultipleAssertions(
    @Asserts() assert: Assert,
  ) {
    assert.equal(42, 42);
    assert.equal("Hello", "Hello");
  }

}

const runner = new IronTest();
runner.add([ MultipleAssertions.testWithMultipleAssertions ]);
runner
  .run({
    tap: true,
    checkCycles: true,
    cycleHumanOutput: true,
  })
  .promise();
