import { TestClassInstance } from "../internal/TestClassInstance";
import { TestInstance } from "../internal/TestInstance";

export function TestName(name: string): ClassDecorator & MethodDecorator {
  function nameTest(target: object, key: string | symbol, descriptor: PropertyDescriptor)
  function nameTest(target: Function)
  function nameTest(target: object, key?: string | symbol, descriptor?: PropertyDescriptor) {
    if(target instanceof Function) {
      // Test class
      const testClass = TestClassInstance.ensureMapped(target);
      testClass.setTestName(name);
    } else {
      // Test method
      const test = TestInstance.ensureMapped(target);
      test.setTestName(name);
    }
  }
  return nameTest;
}
