import test from "ava";
import { TestClass, Test } from "../../../src";
import { TestClassInstance } from "../../../src/internal/TestClassInstance";
import { TestInstance } from "../../../src/internal/TestInstance";

@TestClass()
class SampleClass {

  @Test()
  public static sampleTest() {
  }

}

test("@Test() adds method to parent class", t => {
  const testClass = TestClassInstance.getTestClass(SampleClass);
  t.is(testClass.getTests().length, 1);
});
