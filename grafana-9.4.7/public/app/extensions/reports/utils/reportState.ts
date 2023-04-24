import { Report, ReportState, SchedulingFrequency } from '../../types';

export const getReportStateInfo = (report: Report) => {
  const reportState = report.state;
  const isNever = report.schedule.frequency === SchedulingFrequency.Never;
  const showPlay = isNever || [ReportState.Draft, ReportState.Expired, ReportState.Paused].includes(reportState);
  const disableEdit = isNever || [ReportState.Draft, ReportState.Expired].includes(reportState);

  return { isNever, showPlay, disableEdit, reportState };
};
