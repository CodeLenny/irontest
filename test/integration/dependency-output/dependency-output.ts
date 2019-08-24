import test from "ava";
import * as path from "path";
import { cache, encaseP, map } from "fluture";
import { exec } from "promisify-child-process";

const run = () => exec(`node ${path.resolve(__dirname, "helpers", "DependencyOutput.js")}`);
const results = (cache (encaseP (run) (null)));

test("suite passes", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.log(stdout);
      t.not(stdout.indexOf(`# ok`), -1);
    }))
    .promise();
});

test("runs dependency", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`setup`), -1);
    }))
    .promise();
});

test("test gets value", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.log(stdout);
      t.not(stdout.indexOf(`%% value=42 (number) %%`), -1);
    }))
    .promise();
});
