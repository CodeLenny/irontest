import "reflect-metadata";
import { TestInstance } from "../internal/TestInstance";

/**
 * Mark that a test shouldn't unpack a returned Promise/Future.
 * 
 * If `preTest` returns `Promise.resolve(42)`, and `postTest` depends on `preTest`:
 * 
 * If `preTest` is marked with `@TestReturnsAsync`, `postTest` will get `Promise<42>` from `preTest`.
 * 
 * If `preTest` isn't marked with this annotation, `postTest` will get `42` unpacked.
 */
export function TestReturnsAsync(): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const instance = TestInstance.ensureMapped(descriptor);
    instance.setReturnAsync(true);
  };
}
