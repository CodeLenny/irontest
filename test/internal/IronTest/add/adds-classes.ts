import test from "ava";
import { IronTest, Test, TestClass } from "../../../../src";

@TestClass()
class SampleClass {

  @Test()
  sampleMethod() {

  }

}

test("adds methods from class", t => {
  const runner = new IronTest();
  runner.add([ SampleClass ]);
  t.is(runner.graph().graph.nodeCount(), 3);
});
