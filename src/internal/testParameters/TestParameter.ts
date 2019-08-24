export class TestParameter {

  constructor(
    protected readonly parameterIndex: number,
  ) {
  }

  public getParameterIndex(): number {
    return this.parameterIndex;
  }

}
