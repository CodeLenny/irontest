import { TestClass, Test, Asserts, Assert, IronTest } from "../../../../src";
import { TestDependsOn } from "../../../../src/decorators/TestDependsOn";

let firstTestCalled = false;
let secondTestCalled = false;
let thirdTestCalled = false;

@TestClass()
class DependenciesSameClass {

  @Test()
  @TestDependsOn(DependenciesSameClass.secondTest)
  public static thirdTest(
    @Asserts() assert: Assert,
  ) {
    assert.equal(firstTestCalled, true);
    assert.equal(secondTestCalled, true);
    assert.equal(thirdTestCalled, false);
    thirdTestCalled = true;
  }

  @Test()
  public static firstTest(
    @Asserts() assert: Assert,
  ) {
    assert.equal(firstTestCalled, false);
    assert.equal(secondTestCalled, false);
    assert.equal(thirdTestCalled, false);
    firstTestCalled = true;
  }

  @Test()
  @TestDependsOn(DependenciesSameClass.firstTest)
  public static secondTest(
    @Asserts() assert: Assert,
  ) {
    assert.equal(firstTestCalled, true);
    assert.equal(secondTestCalled, false);
    assert.equal(thirdTestCalled, false);
    secondTestCalled = true;
  }

}

const runner = new IronTest();
runner.add([
  DependenciesSameClass.thirdTest,
  DependenciesSameClass.firstTest,
  DependenciesSameClass.secondTest,
]);
runner
  .run({
    tap: true,
    checkCycles: true,
    cycleHumanOutput: true,
  })
  .promise();
