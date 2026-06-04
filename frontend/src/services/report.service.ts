import api from "./api";

export interface GenerateReportData {
  type: "weekly-report" | "monthly-report" | "custom-report";
  periodStart: string;
  periodEnd: string;
}

export interface GenerateReportResponse {
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

export interface DownloadReportResponse {
  reportId: string;
  s3Key: string;
  type: string;
  downloadUrl: string;
}

export async function generateReport(data: GenerateReportData) {
  const response = await api.post<GenerateReportResponse>(
    "/reports/generate",
    data
  );
  return response.data;
}

export async function downloadReport(reportId: string) {
  const response = await api.get<DownloadReportResponse>("/reports/download", {
    params: { reportId },
  });
  return response.data;
}
