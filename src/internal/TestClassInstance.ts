import { TestEntity } from "./TestEntity";
import { MAPPED_TEST_CLASS, REGISTERED_TEST_CLASS } from "./constants";
import { TestInstance } from "./TestInstance";
import { IronTestGraph } from "./IronTestGraph";
import { TestParameter } from "./testParameters/TestParameter";
import { TestType } from "../runtime/TestTypes";

export class TestClassInstance extends TestEntity {

  public static readonly DEPENDENCY_SUFFIX = "-dependencies";

  /**
   * In an annotation, ensure that the given method has a mapping to a `TestInstance`.
   * Create a new `TestInstance` if one doesn't exist.
   * @param obj The class
   */
  public static ensureMapped(obj: object): TestClassInstance {
    const instance = Reflect.getMetadata(MAPPED_TEST_CLASS, obj);
    if(instance !== undefined) {
      return instance;
    }
    const created = new TestClassInstance();
    Reflect.defineMetadata(MAPPED_TEST_CLASS, created, obj);
    return created;
  }

  /**
   * Get the instance of a registered test class by passing the class.
   *
   * @param test The test to unpack.
   * @return The linked `TestClassInstance` if found, otherwise `undefined` if the entity hasn't been registered with `@TestClass()`.
   */
  public static getTestClass(test: TestType): TestClassInstance | undefined {
    return Reflect.getMetadata(REGISTERED_TEST_CLASS, test);
  }

  protected readonly tests: TestInstance[];

  protected className: string;

  protected testFileName: string;

  protected parameters: { [testName: string]: TestParameter[] };

  constructor() {
    super();
    this.tests = [];
    this.parameters = {};
  }

  public getDependencyId(): string {
    return this.id + TestClassInstance.DEPENDENCY_SUFFIX;
  }

  public setClassName(className: string) {
    this.className = className;
  }

  public getClassName(): string {
    return this.className;
  }

  public setTestFileName(testFileName: string) {
    this.testFileName = testFileName;
  }

  public addTest(test: TestInstance) {
    this.tests.push(test);
  }

  public getTests(): TestInstance[] {
    return this.tests;
  }

  public addParameter(testName: string | symbol, parameter: TestParameter) {
    const testNameString = testName.toString();
    if(!this.parameters[testNameString]) {
      this.parameters[testNameString] = [];
    }
    this.parameters[testNameString].push(parameter);
  }

  public getParameters(testName: string | symbol): TestParameter[] {
    const params = this.parameters[testName.toString()];
    return params || [];
  }

  public label(): string {
    if(this.className) {
      return this.className;
    } else {
      return "Class " + this.id;
    }
  }

  public addToGraph(graph: IronTestGraph): string {
    if(!this.registered) {
      throw new ReferenceError(`Can't add ${this.label()} to the graph as it hasn't been registered with '@TestClass'`);
    }
    if(graph.hasClass(this)) {
      return this.id;
    }
    graph.addClass(this);
    for(const test of this.tests) {
      test.addToGraph(graph);
      graph.addEdge(this, test, `class ${this.label()} contains ${test.label()}`);
    }
    for(const dependency of this.dependencies) {
      const test = TestInstance.getTest(dependency);
      const testClass = TestClassInstance.getTestClass(dependency);
      if(test) {
        test.addToGraph(graph);
        graph.addEdge(this.getDependencyId(), test, "@DependsOn");
      } else if(testClass) {
        testClass.addToGraph(graph);
        graph.addEdge(this.getDependencyId(), testClass, "@DependsOn");
      } else {
        throw new ReferenceError(`${this.label()} depends on an entity not registered with '@Test' or '@TestClass'`);
      }
    }
    return this.id;
  }

}
