import test from "ava";
import { TestClass, Test, IronTest } from "../../../../src";
import { defaultRunConfiguration } from "../../../helpers/defaultTestConfig";
import { TestInstance } from "../../../../src/internal/TestInstance";
import { TestClassDependenciesNode } from "../../../../src/internal/TestClassDependenciesNode";
import { TestClassInstance } from "../../../../src/internal/TestClassInstance";
import { StartTestNode } from "../../../../src/internal/StartTestNode";

@TestClass()
class SingleTestClass {

  @Test()
  public static test() {}

}

test("uses regular ordering", t => {
  const runner = new IronTest();
  runner.add([ SingleTestClass.test ]);
  const graph = runner.graph();
  const order = graph.getSortedTests(defaultRunConfiguration);
  t.log(order);
  t.is(order.length, 3);

  // test() depends on anything SingleTestClass depends on first
  const testClassDependencies = order[0];
  t.true(testClassDependencies instanceof TestClassDependenciesNode);
  t.is((testClassDependencies as TestClassDependenciesNode).getTestClass(), TestClassInstance.getTestClass(SingleTestClass.constructor));

  // test()
  t.is(order[1], TestInstance.getTest(SingleTestClass.test));

  // Start node
  t.true(order[2] instanceof StartTestNode);
});
