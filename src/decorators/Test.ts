import "reflect-metadata";
import { TestInstance } from "../internal/TestInstance";
import { REGISTERED_TEST } from "../internal/constants";
import { TestClassInstance } from "../internal/TestClassInstance";

/**
 * Mark a method as being a test.  Stores metadata about the method.
 */
export function Test(): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    const instance = TestInstance.ensureMapped(descriptor);
    instance.setMethodName(key);
    instance.setTestFunction(method);
    const parent = TestClassInstance.ensureMapped(target);
    parent.addTest(instance);
    instance.setParent(parent);
    instance.register();
    Reflect.defineMetadata(REGISTERED_TEST, instance, descriptor.value);
  };
}
