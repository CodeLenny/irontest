import { TestInstance } from "../internal/TestInstance";
import { RunConfiguration } from "../runtime/RunConfiguration";
import { TestContext } from "../internal/TestContext";

export class Assert {

  constructor(
    protected readonly config: RunConfiguration,
    protected readonly test: TestInstance,
    protected readonly testContext: TestContext,
  ) {
  }

  /**
   * Assert that `actual` is equal to `expected`.
   *
   * @param actual The actual value provided.
   * @param expected The value expected.
   * @param message A description to provide if the values are unequal.
   */
  equal<T>(actual: T, expected: T, message?: string) {
    this.testContext.tapeContext.equal(actual, expected, message);
  }

  /**
   * Assert that `test` is equal to `true`.
   *
   * @param test A value to determine if `true`.
   * @param message A description to provide if the value is not `true`.
   */
  true(test: any, message?: string) {
    this.testContext.tapeContext.true(test, message);
  }

  /**
   * Assert that `test` is equal to `false`.
   *
   * @param test A value to determine if `false`.
   * @param message A description to provide if the value is not `false`.
   */
  false(test: any, message?: string) {
    this.testContext.tapeContext.false(test, message);
  }

  /**
   * Cause the test to immediately fail.
   *
   * @param message The message to provide when failing the test.
   */
  fail(message?: string) {
    this.testContext.tapeContext.fail(message);
  }

  /**
   * Display a logged message, ensuring that output isn't broken when displaying the message.
   *
   * @param message Text to log.
   */
  log(message: string) {
    this.testContext.tapeContext.comment(message);
  }

}
