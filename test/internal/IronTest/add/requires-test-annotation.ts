import test from "ava";
import { IronTest, TestClass } from "../../../../src";

@TestClass()
class SampleClass {

  public static sampleMethod() {
  }

}

test("requires '@Test' annotation", t => {
  const runner = new IronTest();
  t.throws(() => runner.add([ SampleClass.sampleMethod ]), ReferenceError);
});
