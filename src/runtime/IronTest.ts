import "reflect-metadata";
import { parallel, FutureInstance, map } from "fluture";
import { TestInstance } from "../internal/TestInstance";
import { TestClassInstance } from "../internal/TestClassInstance";
import { REGISTERED_TEST, REGISTERED_TEST_CLASS } from "../internal/constants";
import { IronTestGraph } from "../internal/IronTestGraph";
import { RunConfiguration } from "./RunConfiguration";
import { ExitCode } from "./ExitCode";
import { TestSummary } from "../internal/TestSummary";

/**
 * The test runner.
 */
export class IronTest {

  private readonly addedTests: TestInstance[];
  private readonly addedTestClasses: TestClassInstance[];

  constructor() {
    this.addedTests = [];
    this.addedTestClasses = [];
  }

  /**
   * Add the provided tests and all dependencies to the list of tests that will be run.
   * 
   * Accepts:
   * 
   * - Individual `@Test` methods to be run.
   * - `@TestClass` classes, which will run all containing tests.
   * 
   * @param entries A list of `@Test` methods or `@TestClass` classes.
   */
  public add(entries: object[]) {
    for(let entryIndex = 0; entryIndex < entries.length; ++entryIndex) {
      const entry = entries[entryIndex];
      const testInstance = Reflect.getOwnMetadata(REGISTERED_TEST, entry);
      const testClassInstance = Reflect.getMetadata(REGISTERED_TEST_CLASS, entry);
      if(testInstance) {
        this.addedTests.push(testInstance);
      } else if(testClassInstance) {
        this.addedTestClasses.push(testClassInstance);
      } else {
        throw new ReferenceError(`Entry ${entryIndex} was not registered.  Make sure you use '@Test' or '@TestClass'.`);
      }
    }
  }

  /**
   * Get a dependency graph of all tests.
   */
  public graph(): IronTestGraph {
    const graph = new IronTestGraph();
    for(const test of this.addedTests) {
      graph.runTest(test);
    }
    for(const testClass of this.addedTestClasses) {
      graph.runClass(testClass);
    }
    return graph;
  }

  /**
   * Run the added tests according to the test configuration.
   *
   * @param config The user-provided configuration.
   */
  public run(config: RunConfiguration): FutureInstance<Error, TestSummary> {
    const graph = this.graph();
    this.validate(config, graph);
    const summary = new TestSummary();
    const tests = graph.getSortedTests(config);
    const runs = tests
      .filter(test => test instanceof TestInstance)
      .map(test => (test as TestInstance).run(config, summary))
    return parallel(1, runs)
      .pipe (map (res => summary))
      .pipe (map (summary => {
        if(config.tap) {
          const todoCount = summary.getTodoCount();
          const bypassCount = summary.getBypassCount();
          console.log();
          if(todoCount > 0) {
            console.log(`# todo  ${todoCount}`);
          }
          if(bypassCount > 0) {
            console.log(`# bypass ${bypassCount}`);
          }
        }
        return summary;
      }))
    // TODO: Handle top-level errors and exit (optionally)
  }

  /**
   * Validate that the dependency graph is suitable for running, including checking for cycles.
   *
   * @param config The user-provided configuration.
   * @param graph The graph to validate.
   */
  public validate(
    config: RunConfiguration,
    graph: IronTestGraph,
  ) {
    if(config.checkCycles && !graph.isAcyclic()) {
      if(config.cycleHumanOutput) {
        const cycles = graph.getCycles();
        console.error("Cycles found in test dependency graph.\n");
        for(let cycleIndex = 0; cycleIndex < cycles.length; ++cycleIndex) {
          const nodes = cycles[cycleIndex];
          const nodeLabels = nodes.map(node => node.label());
          console.error(`Cycle ${cycleIndex}:`);
          console.error(nodeLabels.join(" -> "));
          // TODO: Display edge labels?
        }
      } else {
        // TODO: Output more computer-friendly error message
        console.error("Cycle found");
      }
      process.exit(ExitCode.CYCLE_FOUND);
    }
  }

}
