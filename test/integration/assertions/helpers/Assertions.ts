import { TestClass, Test, IronTest, Asserts, Assert } from "../../../../src";
import { defaultRunConfiguration } from "../../../helpers/defaultTestConfig";

@TestClass()
export class Assertions {

  @Test()
  public static equalNumber(
    @Asserts() assert: Assert,
  ) {
    assert.equal(1, 1, "1. numbers are equal");
  }

  @Test()
  public static equalFail(
    @Asserts() assert: Assert,
  ) {
    assert.equal(1, 2, "2. equal fails");
  }

  @Test()
  public static truePass(
    @Asserts() assert: Assert,
  ) {
    assert.true(true, "3. true is true");
  }

  @Test()
  public static trueFail(
    @Asserts() assert: Assert,
  ) {
    assert.true(false, "4. true fails");
  }

  @Test()
  public static falsePass(
    @Asserts() assert: Assert,
  ) {
    assert.false(false, "5. false is false");
  }

  @Test()
  public static falseFail(
    @Asserts() assert: Assert,
  ) {
    assert.false(true, "6. false fails");
  }

  @Test()
  public static fail(
    @Asserts() assert: Assert,
  ) {
    assert.fail("7. just fails");
  }

}

const runner = new IronTest();
runner.add([ Assertions ]);
runner
  .run(defaultRunConfiguration)
  .promise();
