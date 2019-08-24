import test from "ava";
import { TestClass, Test } from "../../../src";
import { TestInstance } from "../../../src/internal/TestInstance";
import { REGISTERED_TEST } from "../../../src/internal/constants";

@TestClass()
class SampleClass {

  @Test()
  public static testMethod() {
  }

}

test("stores method name", t => {
  const test: TestInstance = Reflect.getOwnMetadata(REGISTERED_TEST, SampleClass.testMethod);
  t.true(test.label().indexOf(".testMethod") > -1);
});


test("combines class and method name", t => {
  const test: TestInstance = Reflect.getOwnMetadata(REGISTERED_TEST, SampleClass.testMethod);
  t.is(test.label(), "SampleClass.testMethod");
});
