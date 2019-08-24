import test from "ava";
import * as path from "path";
import { cache, encaseP, map } from "fluture";
import { exec } from "promisify-child-process";

const run = () => exec(`node ${path.resolve(__dirname, "helpers", "MultipleAssertions.js")}`);
const results = (cache (encaseP (run) (null)));

test("suite passes", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# ok`), -1);
    }))
    .promise();
});

test("prints each assertion", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`ok 1`), -1);
      t.not(stdout.indexOf(`ok 2`), -1);
    }))
    .promise();
});

test("counts assertions", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# tests 2`), -1);
    }))
    .promise();
});
