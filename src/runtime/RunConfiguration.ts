export interface RunConfiguration {

  /**
   * If output should be formatted using TAP.
   */
  tap: true;

  /**
   * If `true`, will check the graph for cycles to ensure no infinite dependency loops exist.
   */
  checkCycles: boolean;

  /**
   * If `true`, will output a textual description of any cycles found and exit with `ExitCode.CYCLE_FOUND`.
   *
   * If `false`, will just exit with `ExitCode.CYCLE_FOUND` exit code and a generic error.
   */
  cycleHumanOutput: boolean;

}
