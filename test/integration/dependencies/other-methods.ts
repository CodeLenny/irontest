import test from "ava";
import * as path from "path";
import { cache, encaseP, map } from "fluture";
import { exec } from "promisify-child-process";

const run = () => exec(`node ${path.resolve(__dirname, "helpers", "DependenciesSameClass.js")}`);
const results = (cache (encaseP (run) (null)));

test("suite passes", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# ok`), -1);
    }))
    .promise();
});

test("runs 9 assertions", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# pass  9`), -1);
    }))
    .promise();
});
