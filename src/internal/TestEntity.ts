import * as uuid from "uuid/v4";
import { TestType } from "../runtime/TestTypes";

export abstract class TestEntity {

  protected readonly id: string;

  /**
   * If the test has been "registered" with `@Test`, `@TestClass`, etc.
   */
  protected registered: boolean;

  protected name: string;

  protected readonly dependencies: TestType[];

  constructor() {
    this.id = uuid();
    this.registered = false;
    this.dependencies = [];
  }

  public getId(): string {
    return this.id;
  }

  public setTestName(name: string) {
    this.name = name;
  }

  public register() {
    this.registered = true;
  }

  public addDependency(dependency: TestType) {
    if(!this.dependencies.includes(dependency)) {
      this.dependencies.push(dependency);
    }
  }

  /**
   * Get a user-friendly label describing this entity.
   */
  public abstract label(): string;

}
