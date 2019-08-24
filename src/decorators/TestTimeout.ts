import "reflect-metadata";
import { TestInstance } from "../internal/TestInstance";

/**
 * Set a timeout to prevent tests from running too long.
 *
 * @param maximumDuration The maximum number of milliseconds that the test can run for.
 */
export function TestTimeout(maximumDuration: number): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const instance = TestInstance.ensureMapped(descriptor);
    instance.setTimeout(maximumDuration);
  };
}
