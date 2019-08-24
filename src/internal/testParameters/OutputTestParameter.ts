import { TestParameter } from "./TestParameter";
import { TestInstance } from "../TestInstance";

export class OutputTestParameter extends TestParameter {

  protected readonly testMethod: TestInstance;

  protected readonly addDependency: boolean;

  constructor(parameterIndex: number, testMethod: TestInstance, addDependency: boolean) {
    super(parameterIndex);
    this.testMethod = testMethod;
    this.addDependency = addDependency;
  }

  public getTestMethod(): TestInstance {
    return this.testMethod;
  }

  public getAddDependency(): boolean {
    return this.addDependency;
  }

}
