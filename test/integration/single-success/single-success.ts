import test from "ava";
import * as path from "path";
import { cache, encaseP, map } from "fluture";
import { exec } from "promisify-child-process";

const run = () => exec(`node ${path.resolve(__dirname, "helpers", "single-test.js")}`);
const results = (cache (encaseP (run) (null)));

test("suite passes", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# ok`), -1);
    }))
    .promise();
});

test("doesn't produce stderr", t => {
  return results
    .pipe (map (out => out.stderr))
    .pipe (map (stderr => {
      t.is(stderr, "");
    }))
    .promise();
});

test("single assertion passes", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`ok 1`), -1);
    }))
    .promise();
});

test("1 assertions run", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# tests 1`), -1);
    }))
    .promise();
});

test("1 assertion passes", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.not(stdout.indexOf(`# pass  1`), -1);
    }))
    .promise();
});

test("no assertions fail", t => {
  return results
    .pipe (map (out => out.stdout))
    .pipe (map (stdout => {
      t.is(stdout.indexOf(`# fail`), -1);
    }))
    .promise();
});

