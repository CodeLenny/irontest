import test from "ava";
import * as path from "path";
import { cache, encaseP, map } from "fluture";
import { exec } from "promisify-child-process";

const run = () => exec(`node ${path.resolve(__dirname, "helpers", "AsyncOutput.js")}`);
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

test("passes 8 tests", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# pass  8`), -1);
    }))
    .promise();
});
