import test from "ava";
import { IronTestGraph } from "../../../../src/internal/IronTestGraph";
import { TestInstance } from "../../../../src/internal/TestInstance";
import { TestClassInstance } from "../../../../src/internal/TestClassInstance";

test("returns tests", t => {
  const graph = new IronTestGraph();
  const test = new TestInstance();
  graph.addTest(test);
  t.is(graph.findNodeById(test.getId()), test);
});

test("returns classes", t => {
  const graph = new IronTestGraph();
  const testClass = new TestClassInstance();
  graph.addClass(testClass);
  t.is(graph.findNodeById(testClass.getId()), testClass);
});
