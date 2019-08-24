import test from "ava";
import { TestClass } from "../../../src";
import { REGISTERED_TEST, REGISTERED_TEST_CLASS } from "../../../src/internal/constants";
import { TestClassInstance } from "../../../src/internal/TestClassInstance";

@TestClass()
class SampleClass {

}

test("stores class name", t => {
  const test: TestClassInstance = Reflect.getOwnMetadata(REGISTERED_TEST_CLASS, SampleClass);
  t.is(test.getClassName(), "SampleClass");
});

test("uses class name in label", t => {
  const test: TestClassInstance = Reflect.getOwnMetadata(REGISTERED_TEST_CLASS, SampleClass);
  t.is(test.label(), "SampleClass");
});
