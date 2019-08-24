import { TestClass, Test, IronTest, Asserts, Assert, BypassTest, TestOutput } from "../../../../src";

@TestClass()
export class BypassedTest {

  @Test()
  @BypassTest(42)
  public static bypassed(
    @Asserts() assert: Assert,
  ) {
    assert.fail("Bypassed test should not be run.");
  }

  @Test()
  public static test(
    @Asserts() assert: Assert,
    @TestOutput(BypassedTest.bypassed) output,
  ) {
    assert.equal(output, 42);
  }

}

const runner = new IronTest();
runner.add([ BypassedTest ]);
runner
  .run({
    tap: true,
    checkCycles: true,
    cycleHumanOutput: true,
  })
  .promise();
