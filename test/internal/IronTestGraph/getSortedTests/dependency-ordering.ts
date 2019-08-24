import test from "ava";
import { TestClass, Test, IronTest } from "../../../../src";
import { TestDependsOn } from "../../../../src/decorators/TestDependsOn";
import { defaultRunConfiguration } from "../../../helpers/defaultTestConfig";
import { TestClassDependenciesNode } from "../../../../src/internal/TestClassDependenciesNode";
import { TestInstance } from "../../../../src/internal/TestInstance";
import { TestClassInstance } from "../../../../src/internal/TestClassInstance";
import { StartTestNode } from "../../../../src/internal/StartTestNode";

@TestClass()
class BaseClass {

  @Test()
  public static firstBaseTest() {
  }

  @Test()
  @TestDependsOn(BaseClass.firstBaseTest)
  public static secondBaseTest() {
  }

}

@TestClass()
class OtherBaseClass {

  @Test()
  @TestDependsOn(OtherBaseClass.firstOtherTest)
  public static secondOtherTest() {
  }

  @Test()
  public static firstOtherTest() {
  }

}

@TestClass()
@TestDependsOn(BaseClass)
class DependsOnClass {

  @Test()
  @TestDependsOn(OtherBaseClass)
  public static dependencyTest() {
  }

}

test("dependencies are correctly ordered inside a class", t => {
  const runner = new IronTest();
  runner.add([
    BaseClass,
  ]);
  const graph = runner.graph();
  const order = graph.getSortedTests(defaultRunConfiguration);

  t.log(order);

  t.is(order.length, 5);
  t.true(order[0] instanceof TestClassDependenciesNode);
  t.is(order[1], TestInstance.getTest(BaseClass.firstBaseTest));
  t.is(order[2], TestInstance.getTest(BaseClass.secondBaseTest));
  t.is(order[3], TestClassInstance.getTestClass(BaseClass));
  t.true(order[4] instanceof StartTestNode);
});

test("sorts wrongly ordered tests", t => {
  const runner = new IronTest();
  runner.add([
    OtherBaseClass,
  ]);
  const graph = runner.graph();
  const order = graph.getSortedTests(defaultRunConfiguration);

  t.log(order);

  t.is(order.length, 5);
  t.true(order[0] instanceof TestClassDependenciesNode);
  t.is(order[1], TestInstance.getTest(OtherBaseClass.firstOtherTest));
  t.is(order[2], TestInstance.getTest(OtherBaseClass.secondOtherTest));
  t.is(order[3], TestClassInstance.getTestClass(OtherBaseClass));
  t.true(order[4] instanceof StartTestNode);
});

test("sorts class and test dependencies", t => {
  const runner = new IronTest();
  runner.add([
    DependsOnClass,
  ]);
  const graph = runner.graph();
  const order = graph.getSortedTests(defaultRunConfiguration);

  t.log(order);

  // Base Class
  t.true(order[0] instanceof TestClassDependenciesNode);
  t.is((order[0] as TestClassDependenciesNode).getTestClass(), TestClassInstance.getTestClass(BaseClass));
  t.is(order[1], TestInstance.getTest(BaseClass.firstBaseTest));
  t.is(order[2], TestInstance.getTest(BaseClass.secondBaseTest));
  t.is(order[3], TestClassInstance.getTestClass(BaseClass));

  // or(TestClassDependenciesNode for DependsOnClass,
  //    OtherBaseClass)

  t.true(order[4] instanceof TestClassDependenciesNode);
  if((order[4] as TestClassDependenciesNode).getTestClass() === TestClassInstance.getTestClass(DependsOnClass)) {
    t.is((order[5] as TestClassDependenciesNode).getTestClass(), TestClassInstance.getTestClass(OtherBaseClass));
    t.is(order[6], TestInstance.getTest(OtherBaseClass.firstOtherTest));
    t.is(order[7], TestInstance.getTest(OtherBaseClass.secondOtherTest));
    t.is(order[8], TestClassInstance.getTestClass(OtherBaseClass));
  } else {
    t.is((order[4] as TestClassDependenciesNode).getTestClass(), TestClassInstance.getTestClass(OtherBaseClass));
    t.is(order[5], TestInstance.getTest(OtherBaseClass.firstOtherTest));
    t.is(order[6], TestInstance.getTest(OtherBaseClass.secondOtherTest));
    t.is(order[7], TestClassInstance.getTestClass(OtherBaseClass));
    t.is((order[8] as TestClassDependenciesNode).getTestClass(), TestClassInstance.getTestClass(DependsOnClass));
  }

  // DependsOnClass.dependencyTest
  t.is(order[9], TestInstance.getTest(DependsOnClass.dependencyTest));

  // DependsOnClass

  t.is(order[10], TestClassInstance.getTestClass(DependsOnClass));

  // Start Node

  t.true(order[11] instanceof StartTestNode);
});
