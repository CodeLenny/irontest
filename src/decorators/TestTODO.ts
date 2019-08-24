import "reflect-metadata";
import { TestInstance } from "../internal/TestInstance";

/**
 * Add a comment that will be output each time the test is run.
 * Can be used multiple times on a single test to leave multiple messages.
 * 
 * Also adds an allowed-to-fail test to flag the test as needing an action.
 */
export function TestTODO(message: string): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const instance = TestInstance.ensureMapped(descriptor);
    instance.addTodo(message);
  };
}
