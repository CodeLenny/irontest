import test, { Macro } from "ava";
import * as path from "path";
import Future, { cache, encaseP, map, chainRej } from "fluture";
import { exec, Output } from "promisify-child-process";

const run = () => exec(`node ${path.resolve(__dirname, "helpers", "TestTodos.js")}`);
const results = (cache (encaseP (run) (null)))
  .pipe (chainRej ((err: Output) => {
    return Future.resolve(err);
  }));

const passing: Macro<[string]> = (t, assertion) => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.log(stdout);
      const regex = new RegExp(`\\nok\\s+[0-9]+\\s+${assertion}`, "g");
      t.true(regex.test(stdout.toString()));
    }))
    .promise();
};

const failing: Macro<[string]> = (t, assertion) => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.log(stdout);
      const regex = new RegExp(`not ok\\s+[0-9]+\\s+${assertion}`, "g");
      t.true(regex.test(stdout.toString()));
    }))
    .promise();
};

test("suite passes", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# ok`), -1);
    }))
    .promise();
});

test("method with single TODO runs assertion", passing, "1. single todo passes");

test("method with two TODOs runs assertion", passing, "2. double todo passes");

test("Single TODO produces failing check", failing, "This is a single TODO");

test("Double TODO (1) produces failing check", failing, "First TODO");

test("Double TODO (2) produces failing check", failing, "Second TODO");

test("counts todos", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# todo  3`), -1);
    }))
    .promise();
});
