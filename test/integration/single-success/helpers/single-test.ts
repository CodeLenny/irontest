import { TestClass, Test, IronTest, Asserts, Assert } from "../../../../src";

@TestClass()
export class SingleTestClass {

  @Test()
  public static singleTest(
    @Asserts() assert: Assert,
  ) {
    assert.equal(42, 42);
  }

}

const runner = new IronTest();
runner.add([ SingleTestClass.singleTest ]);
runner
  .run({
    tap: true,
    checkCycles: true,
    cycleHumanOutput: true,
  })
  .promise();
