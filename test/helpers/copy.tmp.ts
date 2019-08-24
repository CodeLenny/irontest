import { Test, TestOutput, TestDependsOn, Asserts, Assert, TestClass } from "../../src";

interface ReportData {
}

interface Report {
  id: string;
  name: string;
  data: ReportData;
}

@TestClass()
class CreateReport {

  @Test()
  public static reportName() {
    return "A Sample Report";
  }

  @Test()
  public static createReport(
    @TestOutput(CreateReport.reportName) name: string,
    @RepeatedTestOutput(CreateReportData.createReportData) reportData: ReportData,
  ): Report {
    return {
      id: "report-1",
      name,
      data: reportData,
    };
  }

  @Test()
  @CreateParameterizedTest(CreateReportData.deleteReportData)
  public static deleteReport(
    @ParameterizedTestField() report: Report,
    @ParameterizedTest(CreateReportData.deleteReportData) deleteReportData: ParameterizedTestHandler,
  ) {
    deleteReportData.setParameter(report.data);
  }

}

@TestClass()
class ReportTests {

  @Test()
  public static createReport(
    @RepeatedTestOutput(CreateReport.createReport) report: Report,
  ) {
    return report;
  }

  @Test()
  public static reportHasId(
    @Asserts() assert: Assert,
    @TestOutput(ReportTests.createReport) report: Report,
  ) {
    assert.equal(typeof report.name, "string");
  }

  @Test()
  public static reportHasName(
    @Asserts() assert: Assert,
    @TestOutput(ReportTests.createReport) report: Report,
  ) {
    assert.equal(typeof report.name, "string");
  }

  @Test()
  @CreateParameterizedTest(CreateReport.deleteReport)
  @TestDependsOn(ReportTest.reportHasId)
  @TestDependsOn(ReportTests.reportHasName)
  public static deleteReport(
    @TestOutput(ReportTests.createReport) report: Report,
    @ParameterizedTest(CreateReport.deleteReport) deleteReport: ParameterizedTestHandler,
  ) {
    deleteReport.setParameter(report);
  }

}
