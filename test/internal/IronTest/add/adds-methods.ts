import test from "ava";
import { IronTest, Test, TestClass } from "../../../../src";

@TestClass()
class SampleClass {

  @Test()
  public static sampleMethod() {
  }

}

test("adds class", t => {
  const runner = new IronTest();
  runner.add([ SampleClass.sampleMethod ]);
  t.is(runner.graph().graph.nodeCount(), 3);
});
