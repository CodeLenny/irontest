/**
 * Contains a summary of the test run.
 */
export class TestSummary {

  /**
   * A count of tests that pass all assertions.
   */
  private passingCount: number;

  /**
   * A count of tests that actively fail an assertion.
   */
  private failingCount: number;

  /**
   * A count of TODO comments from any test.
   * Each TODO left on a test is counted, even if multiple TODOs are on the same test.
   */
  private todoCount: number;

  private bypassCount: number;

  constructor() {
    this.passingCount = 0;
    this.failingCount = 0;
    this.todoCount = 0;
    this.bypassCount = 0;
  }

  public testPassed() {
    ++this.passingCount;
  }

  public testFailed() {
    ++this.failingCount;
  }

  public todoComment() {
    ++this.todoCount;
  }

  public testBypassed() {
    ++this.bypassCount;
  }

  public getTodoCount(): number {
    return this.todoCount;
  }

  public getBypassCount(): number {
    return this.bypassCount;
  }

}
