import { css } from '@emotion/css';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Button, useStyles2 } from '@grafana/ui';

import { StepKey } from '../../types';
import { getNextStep, getPreviousStep, goToPreviousStep } from '../utils/stepper';

interface ButtonRowProps {
  activeStep: StepKey;
  existingReport: boolean;
  saveDraft: () => void;
  disabled?: boolean;
  reportId?: string;
}

export type ButtonHandle = {
  click: () => void;
};

export const ButtonRow = forwardRef<ButtonHandle, ButtonRowProps>(
  ({ activeStep, existingReport, disabled, saveDraft, reportId }, ref) => {
    const styles = useStyles2(getStyles);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const previousStep = getPreviousStep(activeStep);
    const nextStep = getNextStep(activeStep);
    const isLastStep = nextStep.id === activeStep;
    const buttonText = isLastStep ? (existingReport ? 'Update report' : 'Save report') : `Next: ${nextStep.name}`;

    // Enable clicking Submit from a parent component
    useImperativeHandle(ref, () => ({
      click: () => {
        buttonRef.current?.click();
      },
    }));

    return (
      <div className={styles.buttonRow}>
        <div className={styles.buttonRowInner}>
          <div>
            {previousStep && (
              <Button variant={'secondary'} onClick={() => goToPreviousStep(activeStep, reportId)}>
                Previous: {previousStep.name}
              </Button>
            )}
            <Button ref={buttonRef} disabled={disabled} type="submit">
              {buttonText}
            </Button>
          </div>
          <Button variant={'secondary'} onClick={saveDraft}>
            Save as draft
          </Button>
        </div>
      </div>
    );
  }
);

ButtonRow.displayName = 'ButtonRow';

const getStyles = (theme: GrafanaTheme2) => {
  return {
    buttonRow: css`
      display: flex;
      padding: ${theme.spacing(2, 0, 0.5, 0)};
      border-top: 1px solid ${theme.colors.secondary.border};
      width: 100%;
      background-color: ${theme.colors.background.primary};
      button {
        &:first-of-type {
          margin-right: ${theme.spacing(2)};
        }
        &:last-of-type {
          margin-right: 0;
        }
      }
    `,
    buttonRowInner: css`
      display: flex;
      justify-content: space-between;
      margin-left: calc(min(30%, 200px) + 72px); // align with form
      width: min(70%, 800px);
    `,
  };
};
