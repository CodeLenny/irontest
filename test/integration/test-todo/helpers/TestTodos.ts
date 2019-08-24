import { TestClass, Test, IronTest, Asserts, Assert, TestTODO } from "../../../../src";
import { defaultRunConfiguration } from "../../../helpers/defaultTestConfig";

@TestClass()
export class TestTodos {

  @Test()
  @TestTODO("This is a single TODO")
  public static singleTodo(
    @Asserts() assert: Assert,
  ) {
    assert.equal(1, 1, "1. single todo passes");
  }

  @Test()
  @TestTODO("First TODO")
  @TestTODO("Second TODO")
  public static equalFail(
    @Asserts() assert: Assert,
  ) {
    assert.equal(1, 1, "2. double todo passes");
  }

}

const runner = new IronTest();
runner.add([ TestTodos ]);
runner
  .run(defaultRunConfiguration)
  .promise();
