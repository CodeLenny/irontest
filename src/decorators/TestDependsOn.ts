import { TestClassInstance } from "../internal/TestClassInstance";
import { TestInstance } from "../internal/TestInstance";
import { TestType } from "../runtime/TestTypes";

export function TestDependsOn(dependency: TestType): ClassDecorator & MethodDecorator {
  function testDependency(target: object, key: string | symbol, descriptor: PropertyDescriptor)
  function testDependency(target: Function)
  function testDependency(target: object, key?: string | symbol, descriptor?: PropertyDescriptor) {
    if(descriptor && typeof descriptor.value === "function") {
      // Test method
      const test = TestInstance.ensureMapped(descriptor);
      test.addDependency(dependency);
    } else {
      // Test class
      const testClass = TestClassInstance.ensureMapped(target);
      testClass.addDependency(dependency);
    }
  }
  return testDependency;
}
