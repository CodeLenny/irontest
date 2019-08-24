import "reflect-metadata";
import { TestClassInstance } from "../internal/TestClassInstance";
import { REGISTERED_TEST_CLASS } from "../internal/constants";

export function getTestFile(): string {
  let mod = module;
  while(mod.parent && (
       mod.id.endsWith("/decorators/TestClass.js")
    || mod.id.endsWith("/decorators/index.js")
    || mod.id.endsWith("/src/index.js")
  )) {
    mod = mod.parent;
  }
  return mod.id;
}

/**
 * Mark a class as containing tests.  Stores metadata about the class.
 */
export function TestClass(): ClassDecorator {
  const testFile = getTestFile();
  return (target: Function) => {
    const instance = TestClassInstance.ensureMapped(target);
    instance.setTestFileName(testFile);
    instance.setClassName(target.name);
    instance.register();
    Reflect.defineMetadata(REGISTERED_TEST_CLASS, instance, target);
  }
}
