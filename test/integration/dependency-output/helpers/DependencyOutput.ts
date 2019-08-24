import { TestClass, Test, Asserts, Assert, IronTest } from "../../../../src";
import { TestOutput } from "../../../../src/decorators/TestOutput";

@TestClass()
class DependencyOutput {

  @Test()
  public static setup() {
    return 42;
  }

  @Test()
  public static theTest(
    @Asserts() assert: Assert,
    @TestOutput(DependencyOutput.setup) value,
  ) {
    assert.log(`%% value=${value} (${typeof value}) %%`);
    assert.equal(value, 42);
  }

}

const runner = new IronTest();
runner.add([ DependencyOutput.theTest ]);
runner
  .run({
    tap: true,
    checkCycles: true,
    cycleHumanOutput: true,
  })
  .promise();
