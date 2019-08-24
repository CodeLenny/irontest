import { isSymbol } from "util";
import Future, { FutureInstance, isFuture, fork, tryP } from "fluture";
import * as tape from "tape";
import { MAPPED_TEST, REGISTERED_TEST } from "../internal/constants";
import { TestEntity } from "./TestEntity";
import { TestClassInstance } from "./TestClassInstance";
import { IronTestGraph } from "./IronTestGraph";
import { RunConfiguration } from "../runtime/RunConfiguration";
import { AssertsTestParameter } from "./testParameters/AssertsTestParameter";
import { Assert } from "../runtime/Assert";
import { TestType } from "../runtime/TestTypes";
import { OutputTestParameter } from "./testParameters/OutputTestParameter";
import { TestSummary } from "./TestSummary";

export class TestInstance extends TestEntity {

  /**
   * In an annotation, ensure that the given method has a mapping to a `TestInstance`.
   * Create a new `TestInstance` if one doesn't exist.
   * @param descriptor The annotation descriptor
   */
  public static ensureMapped(descriptor: PropertyDescriptor | Function): TestInstance {
    if(typeof descriptor === "object" && typeof descriptor.value === "function") {
      descriptor = descriptor.value;
    }
    const instance = Reflect.getMetadata(MAPPED_TEST, descriptor);
    if(instance !== undefined) {
      return instance;
    }
    const created = new TestInstance();
    Reflect.defineMetadata(MAPPED_TEST, created, descriptor);
    return created;
  }

  /**
   * Get the instance of a registered test by passing the method.
   *
   * @param test The test to unpack.
   * @return The linked `TestInstance` if found, otherwise `undefined` if the entity hasn't been registered with `@Test()`.
   */
  public static getTest(test: TestType): TestInstance | undefined {
    return Reflect.getMetadata(REGISTERED_TEST, test);
  }

  /**
   * The parent object.
   */
  protected parent: TestClassInstance;

  /**
   * The JS name of the testing method.
   */
  protected methodName: string;

  /**
   * The contents of the testing method.
   */
  protected testFunction: Function;

  /**
   * `true` if the function should return a Promise or Future instead of the internal value.
   */
  protected returnAsync: boolean;

  /**
   * The count of assertions to expect (plan).
   */
  protected assertionCount: number;

  /**
   * The execution timeout.
   */
  protected timeout: number;

  /**
   * `true` if the test method is currently running.
   */
  protected running: boolean;

  /**
   * The time at which this test function completed,
   * or `null` if the function hasn't completed.
   */
  protected completed: Date | null;

  protected output: any;

  protected bypass: boolean;

  protected bypassValue: any;

  protected todoComments: string[];

  constructor() {
    super();
    this.returnAsync = false;
    this.bypass = false;
    this.todoComments = [];
    this.reset();
  }

  protected reset() {
    this.running = false;
    this.output = false;
    this.completed = null;
  }

  public label(): string {
    if(this.methodName && this.parent && this.parent.getClassName()) {
      return this.parent.getClassName() + "." + this.methodName;
    } else if(this.methodName) {
      return "." + this.methodName;
    } else {
      return "Test " + this.id;
    }
  }

  public setParent(parent: TestClassInstance) {
    this.parent = parent;
  }

  public setMethodName(methodName: string | symbol) {
    if(isSymbol(methodName)) {
      this.methodName = methodName.toString();
    } else {
      this.methodName = methodName;
    }
  }

  public setTestFunction(testFunction: Function) {
    this.testFunction = testFunction;
  }

  public setReturnAsync(returnAsync: boolean) {
    this.returnAsync = returnAsync;
  }

  public setPlan(assertionCount: number) {
    this.assertionCount = assertionCount;
  }

  public setTimeout(maximumDuration: number) {
    this.timeout = maximumDuration;
  }

  public setBypassValue(value: any) {
    this.bypass = true;
    this.bypassValue = value;
  }

  public addTodo(message: string) {
    this.todoComments.push(message);
  }

  public addToGraph(graph: IronTestGraph): string {
    if(!this.registered) {
      throw new ReferenceError(`Can't add ${this.label()}, as it hasn't been registred with '@Test'`);
    }
    if(graph.hasTest(this)) {
      return this.id;
    }
    graph.addTest(this);
    if(this.parent) {
      graph.addEdge(this, this.parent.getDependencyId(), "class dependencies");
    }
    for(const dependency of this.dependencies) {
      const test = TestInstance.getTest(dependency);
      const testClass = TestClassInstance.getTestClass(dependency);
      if(test) {
        test.addToGraph(graph);
        graph.addEdge(this, test, "@DependsOn");
      } else if(testClass) {
        testClass.addToGraph(graph);
        graph.addEdge(this, testClass, "@DependsOn");
      } else {
        throw new ReferenceError(`${this.label()} depends on an entity not registered with '@Test' or '@TestClass'`);
      }
    }
    if(this.parent) {
      for(const parameter of this.parent.getParameters(this.methodName)) {
        if(parameter instanceof OutputTestParameter && parameter.getAddDependency()) {
          const test = parameter.getTestMethod();
          test.addToGraph(graph);
          graph.addEdge(this, test, "@TestOutput");
        }
      }
    }
    return this.id;
  }

  public getName(): string {
    // TODO: Include file name/path (format/tape organization?)
    if(this.name) {
      return this.name;
    } else {
      return this.label();
    }
  }

  public getOutput(): any {
    return this.output;
  }

  public run(config: RunConfiguration, summary: TestSummary): FutureInstance<Error, any> {
    this.reset();
    if(config.tap) {
      if(this.todoComments.length > 0) {
        const todoOptions: tape.TestOptions = {
          todo: true,
        } as tape.TestOptions;
        tape("for " + this.getName(), todoOptions, t => {
          for(const message of this.todoComments) {
            summary.todoComment();
            t.fail(message);
          }
          t.end();
        });
      }
      if(this.bypass) {
        return Future((reject, resolve) => {
          tape("[Bypassed] " + this.getName(), {}, t => {
            summary.testBypassed();
            this.running = false;
            this.completed = new Date();
            this.output = this.bypassValue;
            t.end();
            resolve(this.output);
          });
        });
      }
      return Future((reject, resolve) => {
        this.running = true;
        const tapeConfig: tape.TestOptions = {};
        if(this.timeout) {
          // TODO: Add a little padding for the timeout (if dealing w/ timeout ourselves)
          tapeConfig.timeout = this.timeout;
        }
        tape(
          this.getName(),
          tapeConfig,
          t => {
            if(this.assertionCount) {
              t.plan(this.assertionCount);
            }
            const definedParameters = this.parent.getParameters(this.methodName);
            const parameters = [];
            if(definedParameters) {
              for(const parameter of this.parent.getParameters(this.methodName)) {
                if(parameter instanceof AssertsTestParameter) {
                  parameters[parameter.getParameterIndex()] = new Assert(config, this, {
                    tapeContext: t,
                  });
                } else if(parameter instanceof OutputTestParameter) {
                  if(!parameter.getTestMethod().completed) {
                    reject(new ReferenceError(`Test ${parameter.getTestMethod().label()} hasn't completed yet.`));
                  }
                  parameters[parameter.getParameterIndex()] = parameter
                    .getTestMethod()
                    .getOutput();
                }
              }
            }
            try {
              // TODO: Do timeout ourselves (so we know what's going on),
              //       or add a listener to Tape for failing tests due to timeout
              let output = this.testFunction(...parameters);
              if(!this.returnAsync && this.isPromise(output)) {
                let outputPromise = output;
                output = (tryP (() => outputPromise));
              }
              if(!this.returnAsync && this.isFuture(output)) {
                (resolve (fork (
                            (e: string | Error) => {
                              // Failure
                              if(e instanceof Error) {
                                e = e.message;
                              }
                              t.comment(e);
                              t.fail("Expected test to not throw an error");
                              summary.testFailed();
                              t.end();
                              throw e;
                            })
                            (res => {
                              // Success
                              this.running = false;
                              this.completed = new Date();
                              this.output = res;
                              summary.testPassed();
                              t.end();
                            })
                            (output)));
                return;
              } else {
                this.running = false;
                this.completed = new Date();
                this.output = output;
                summary.testPassed();
                t.end();
                resolve(output);
                return;
              }
            } catch (e) {
              this.running = false;
              this.completed = new Date();
              t.comment(e);
              t.fail("Expected test to not throw an error");
              summary.testFailed();
              t.end();
              resolve(false);
              return;
            }
          }
        );
      });
    }
  }

  private isPromise(val: any): val is Promise<any> {
    return typeof val === "object"
      && typeof val.then === "function"
      && val.then instanceof Function;
  }

  private isFuture(val: any): val is FutureInstance<any, any> {
    return isFuture(val);
  }

}
