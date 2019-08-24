import { TestEntity } from "./TestEntity";
import { TestClassInstance } from "./TestClassInstance";

export class TestClassDependenciesNode extends TestEntity {

  constructor(protected readonly testClass: TestClassInstance) {
    super();
  }

  public getTestClass(): TestClassInstance {
    return this.testClass;
  }

  public label(): string {
    return this.testClass.label() + " [dependencies]";
  }

}
