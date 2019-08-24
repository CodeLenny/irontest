export class ExitCode {

  public static readonly SUCCESS = 0;

  public static readonly CYCLE_FOUND = 1;

  public static readonly NO_TESTS_FOUND = 2;

  public static failedTests(failCount: number) {
    return 50 + failCount;
  }

}
