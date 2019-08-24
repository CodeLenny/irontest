import { TestMethodType } from "../runtime/TestMethodType";
import { TestClassInstance } from "../internal/TestClassInstance";
import { OutputTestParameter } from "../internal/testParameters/OutputTestParameter";
import { TestInstance } from "../internal/TestInstance";

/**
 * Get the output returned by another test function, after the other test runs.
 *
 * @param test The test to read the output from.
 * @param addDependency `true` if you want to automatically add a `@TestDependsOn`
 */
export function TestOutput(test: TestMethodType, addDependency: boolean = true): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const instance = TestClassInstance.ensureMapped(target);
    const dependency = TestInstance.ensureMapped(test);
    instance.addParameter(propertyKey, new OutputTestParameter(parameterIndex, dependency, addDependency));
  };
}
