import test, { Macro } from "ava";
import * as path from "path";
import Future, { cache, encaseP, map, chainRej } from "fluture";
import { exec, Output } from "promisify-child-process";

const run = () => exec(`node ${path.resolve(__dirname, "helpers", "Assertions.js")}`);
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

test("equality holds true on numbers", passing, "1\\. numbers are equal");

test("equality fails", failing, "2\\. equal fails");

test("true passes", passing, "3. true is true");

test("true fails", failing, "4. true fails");

test("false passes", passing, "5. false is false");

test("false fails", failing, "6. false fails");

test("fail works", failing, "7. just fails");
