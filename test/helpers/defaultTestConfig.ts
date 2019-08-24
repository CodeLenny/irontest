import { RunConfiguration } from "../../src/runtime/RunConfiguration";

/**
 * A default configuration suitable for most test scenarios.
 */
export const defaultRunConfiguration: RunConfiguration = {
  tap: true,
  checkCycles: true,
  cycleHumanOutput: false,
};
