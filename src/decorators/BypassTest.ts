import "reflect-metadata";
import { TestInstance } from "../internal/TestInstance";

/**
 * Test parameter to bypass this test with a default output value.
 */
export function BypassTest(value: any): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const instance = TestInstance.ensureMapped(descriptor);
    instance.setBypassValue(value);
  };
}
