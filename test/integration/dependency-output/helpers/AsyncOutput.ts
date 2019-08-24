import { TestClass, Test, TestReturnsAsync, Assert, Asserts, IronTest } from "../../../../src";
import { TestOutput } from "../../../../src/decorators/TestOutput";
import Future from "fluture";
import { defaultRunConfiguration } from "../../../helpers/defaultTestConfig";

@TestClass()
class AsyncOutput {

  @Test()
  public static regularOutput() {
    return 42;
  }

  @Test()
  public static testRegularOutput(
    @Asserts() assert: Assert,
    @TestOutput(AsyncOutput.regularOutput) output,
  ) {
    assert.equal(output, 42);
  }

  @Test()
  @TestReturnsAsync()
  public static regularOutputAsyncFlag() {
    return 42;
  }

  @Test()
  public static testRegularOutputAsyncFlag(
    @Asserts() assert: Assert,
    @TestOutput(AsyncOutput.regularOutputAsyncFlag) output,
  ) {
    assert.equal(output, 42);
  }

  @Test()
  public static promiseOutput() {
    return Promise.resolve(42);
  }

  @Test()
  public static testPromiseOutput(
    @Asserts() assert: Assert,
    @TestOutput(AsyncOutput.promiseOutput) output,
  ) {
    assert.log(output);
    assert.equal(output, 42);
  }

  @Test()
  @TestReturnsAsync()
  public static promiseOutputAsyncFlag() {
    return Promise.resolve(42);
  }

  @Test()
  public static async testPromiseOutputAsyncFlag(
    @Asserts() assert: Assert,
    @TestOutput(AsyncOutput.promiseOutputAsyncFlag) output,
  ) {
    assert.equal(typeof output, "object");
    const val = await output;
    assert.equal(val, 42);
  }

  @Test()
  public static futureOutput() {
    return Future.resolve(42);
  }

  @Test()
  public static testFutureOutput(
    @Asserts() assert: Assert,
    @TestOutput(AsyncOutput.futureOutput) output,
  ) {
    assert.equal(output, 42);
  }

  @Test()
  @TestReturnsAsync()
  public static futureOutputAsyncFlag() {
    return Future.resolve(42);
  }

  @Test()
  public static async testFutureOutputAsyncFlag(
    @Asserts() assert: Assert,
    @TestOutput(AsyncOutput.futureOutputAsyncFlag) output,
  ) {
    assert.equal(typeof output, "object");
    const val = await output.promise();
    assert.equal(val, 42);
  }

}

const runner = new IronTest();
runner.add([ AsyncOutput ]);
runner
  .run(defaultRunConfiguration)
  .promise();
