import { css } from '@emotion/css';
import history from 'history';
import React, { useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { GrafanaTheme2 } from '@grafana/data';
import { config, reportInteraction } from '@grafana/runtime';
import { useStyles2 } from '@grafana/ui';

import { FormPrompt } from '../../shared/FormPrompt';
import { EnterpriseStoreState, Report, ReportState, StepKey } from '../../types';
import { BASE_URL } from '../constants';
import { reportSteps } from '../index';
import { createReport, updateReport } from '../state/actions';
import { addVisitedStep, clearReportState } from '../state/reducers';
import { scheduleUpdated } from '../utils/scheduler';
import { getNextStep } from '../utils/stepper';
import { getSectionUrl } from '../utils/url';

import { ButtonRow } from './ButtonRow';
import { Stepper } from './Stepper';

const mapStateToProps = (state: EnterpriseStoreState) => {
  const { report, isUpdated, visitedSteps } = state.reports;
  return {
    existingReport: !!report.id,
    isUpdated,
    report,
    visitedSteps,
  };
};

const mapActionsToProps = {
  addVisitedStep,
  clearReportState,
  createReport,
  updateReport,
};

export interface OwnProps {
  activeStep: StepKey;
  children: React.ReactNode;
  confirmRedirect?: boolean;
  disabled?: boolean;
  editMode?: boolean;
  getFormData?: () => Partial<Report>;
  onSubmit: () => void;
  reportId?: string;
}

const connector = connect(mapStateToProps, mapActionsToProps);
export type Props = ConnectedProps<typeof connector> & OwnProps;

export const ReportForm = ({
  activeStep,
  addVisitedStep,
  children,
  clearReportState,
  confirmRedirect,
  createReport,
  disabled,
  editMode,
  existingReport,
  getFormData,
  isUpdated,
  onSubmit,
  report,
  reportId,
  updateReport,
  visitedSteps,
}: Props) => {
  const styles = useStyles2(getStyles);
  const nextStep = getNextStep(activeStep);
  const history = useHistory();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [redirect, setRedirect] = useState(confirmRedirect || isUpdated);

  useEffect(() => {
    const addStep = (step: StepKey) => {
      if (step === reportSteps[reportSteps.length - 1].id) {
        addVisitedStep(reportSteps.map((step) => step.id));
      } else {
        addVisitedStep([step]);
      }
    };
    addStep(activeStep);
  }, [activeStep, addVisitedStep]);

  useEffect(() => {
    setRedirect(confirmRedirect || isUpdated);
  }, [confirmRedirect, isUpdated]);

  const onSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const url = getSectionUrl(nextStep.id, reportId);
    onSubmit();
    history.push(url);
  };

  const saveDraft = async () => {
    if (getFormData) {
      const data = getFormData();
      report = { ...report, ...data };
    }
    const createOrUpdate = !!report.id ? updateReport : createReport;
    await createOrUpdate({ ...report, state: ReportState.Draft });
    setRedirect(false);
    reportInteraction('reports_draft_saved');
    clearReportState();
    history.push(BASE_URL);
  };

  const onReportDiscarded = () => {
    clearReportState();
    reportInteraction('reports_report_abandoned', {
      namePopulated: !!report.name,
      recipientsPopulated: !!report.recipients,
      replyToPopulated: !!report.replyTo,
      numberOfDashboardsSelected: report.dashboards.length,
      scheduleCustomized: scheduleUpdated(report.schedule),
    });
  };

  // Detect navigation outside of form to clear form state if no changes to the form have been made
  const detectLeavingForm = (location: history.Location) => {
    const reportFormUrls = reportSteps.map((step) => getSectionUrl(step.id, reportId));
    return !reportFormUrls.includes(location.pathname);
  };

  const onStepChange = () => {
    const lastId = reportSteps[reportSteps.length - 1].id;
    // Do not submit for the last step
    if (activeStep !== lastId) {
      buttonRef.current?.click();
    }
  };

  return (
    <form onSubmit={onSubmitCustom} className={styles.container}>
      <FormPrompt confirmRedirect={redirect} onDiscard={onReportDiscarded} onLocationChange={detectLeavingForm} />
      <div className={styles.inner}>
        {editMode && !config.featureToggles.topnav && <div className={styles.placeholder} />}
        {!editMode && (
          <Stepper
            activeStep={activeStep}
            onStepChange={onStepChange}
            reportId={reportId}
            report={report}
            visitedSteps={visitedSteps}
          />
        )}
        <div className={styles.content}>{children}</div>
      </div>
      {!editMode && (
        <ButtonRow
          ref={buttonRef}
          activeStep={activeStep}
          existingReport={existingReport}
          disabled={disabled}
          saveDraft={saveDraft}
          reportId={reportId}
        />
      )}
    </form>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      height: 100%;
      align-content: center;
    `,
    inner: css`
      display: flex;
      justify-content: flex-start;

      flex: 1 0 auto;
    `,
    content: css`
      width: min(70%, 800px);
      padding-bottom: ${theme.spacing(3)};
    `,
    placeholder: css`
      width: min(30%, 272px);
    `,
  };
};

export default connector(ReportForm);
