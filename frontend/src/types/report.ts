export interface IReportRequest {
  type: "weekly-report" | "monthly-report" | "custom-report";
  periodStart: string;
  periodEnd: string;
}

export interface IReportResponse {
  message: string;
  report: {
    _id: string;
    type: string;
    metadata: {
      periodStart: string;
      periodEnd: string;
    };
    createdAt: string;
  };
}

export interface IDownloadReportResponse {
  reportId: string;
  s3Key: string;
  type: string;
  downloadUrl: string;
}
