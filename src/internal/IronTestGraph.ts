import { Graph, alg as GraphAlg } from "graphlib";
import { TestInstance } from "./TestInstance";
import { TestClassInstance } from "./TestClassInstance";
import { TestEntity } from "./TestEntity";
import { RunConfiguration } from "../runtime/RunConfiguration";
import { StartTestNode } from "./StartTestNode";
import { TestClassDependenciesNode } from "./TestClassDependenciesNode";

/**
 * A graph of all tests, test classes, etc.
 */
export class IronTestGraph {

  /**
   * The internal graph representation.
   */
  public readonly graph: Graph;

  /**
   * A mapping of ID to test for all tests stored in the graph.
   * This allows lookup of tests, as nodes are only stored by ID in the graph.
   */
  private readonly tests: { [id: string]: TestInstance };

  /**
   * A mapping of ID to test for all test classes stored in the graph.
   * This allows lookup of test classes, as nodes are only stored by ID in the graph.
   */
  private readonly testClasses: { [id: string]: TestClassInstance };

  constructor() {
    this.tests = {};
    this.testClasses = {};
    this.graph = new Graph();
    this.graph.setNode("start");
  }

  /**
   * Add the given test to the graph, marking it as one of the initial starting nodes.
   * @param test The test to run.
   */
  public runTest(test: TestInstance) {
    const node = test.addToGraph(this);
    this.graph.setEdge("start", node);
  }

  /**
   * Add all tests in the given class to the graph, marking the class as one of the initial starting nodes.
   * @param testClass The class to add.
   */
  public runClass(testClass: TestClassInstance) {
    const node = testClass.addToGraph(this);
    this.graph.setEdge("start", node);
  }

  /**
   * Add a test method to the graph.
   * @param test The test to add.
   */
  public addTest(test: TestInstance) {
    this.tests[test.getId()] = test;
    this.graph.setNode(test.getId(), test.label());
  }

  /**
   * Determine if a test has been added to the graph.
   *
   * @param test The test to locate.
   */
  public hasTest(test: TestInstance): boolean {
    return this.tests[test.getId()] instanceof TestInstance;
  }

  /**
   * Add a test class to the graph.
   * @param testClass The class to add.
   */
  public addClass(testClass: TestClassInstance) {
    this.testClasses[testClass.getId()] = testClass;
    this.graph.setNode(testClass.getId(), testClass.label());
    this.graph.setNode(testClass.getDependencyId(), testClass.label() + " [dependencies]");
  }

  /**
   * Determine if a test class has been added to the graph.
   *
   * @param testClass The test class to locate.
   */
  public hasClass(testClass: TestClassInstance): boolean {
    return this.testClasses[testClass.getId()] instanceof TestClassInstance;
  }

  /**
   * Add an edge connecting nodes in the graph.
   * @param from The origin entity that depends on `to` or the exact node ID.
   * @param to The destination entity that `from` depends on, or the exact node ID.
   * @param label A textual label to describe this edge.
   */
  public addEdge(from: TestEntity | string, to: TestEntity | string, label: string) {
    this.graph.setEdge(
      from instanceof TestEntity ? from.getId() : from,
      to instanceof TestEntity ? to.getId() : to,
      label,
    );
  }

  public findNodeById(id: string): TestEntity {
    if(id === "start") {
      return new StartTestNode();
    } else if(id.endsWith(TestClassInstance.DEPENDENCY_SUFFIX)) {
      return new TestClassDependenciesNode(this.testClasses[id.replace(TestClassInstance.DEPENDENCY_SUFFIX, "")]);
    }
    return this.tests[id] || this.testClasses[id];
  }

  /**
   * Determine if there are any cycles in this graph.
   */
  public isAcyclic(): boolean {
    return GraphAlg.isAcyclic(this.graph);
  }

  /**
   * Get a list of all cycles, with entries in (dependedOn, dependsOn) order.
   */
  public getCycles(): TestEntity[][] {
    return GraphAlg
      .findCycles(this.graph)
      .map(cycles => cycles.map(node => this.findNodeById(node)));
  }

  /**
   * Get tests in the order that they should be run.
   */
  public getSortedTests(config: RunConfiguration): TestEntity[] {
    return GraphAlg
      .postorder(this.graph, [ "start" ])
      .map(node => this.findNodeById(node));
  }

}
