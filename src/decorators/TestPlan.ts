import "reflect-metadata";
import { TestInstance } from "../internal/TestInstance";

/**
 * Provide a count of the number of assertions that will be made during this test.
 * Must also mark the test with `@Test`.
 */
export function TestPlan(assertionCount: number): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const instance = TestInstance.ensureMapped(descriptor);
    instance.setPlan(assertionCount);
  };
}
