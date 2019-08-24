import { AssertsTestParameter } from "../internal/testParameters/AssertsTestParameter";
import { TestClassInstance } from "../internal/TestClassInstance";

/**
 * Decorator to import the assertion library ([[Assert]]) as a test method parameter.
 * 
 * Example:
 * 
 * ```
 * @Test()
 * public static myTest(
 *   @Asserts() assert: Assert,
 * ) {
 *   assert.equal(42, 42);
 * }
 * ```
 */
export function Asserts(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const instance = TestClassInstance.ensureMapped(target);
    instance.addParameter(propertyKey, new AssertsTestParameter(parameterIndex));
  };
}
