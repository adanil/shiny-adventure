import { css } from '@emotion/css';
import React, { HTMLAttributes, useEffect } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { config } from '@grafana/runtime';
import { CustomScrollbar, useStyles2 } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import PageLoader from 'app/core/components/PageLoader/PageLoader';

import { Report } from '../../types';
import { NoRendererInfoBox } from '../RenderingWarnings';
import { getPageNavInformation } from '../utils/navigation';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  editMode?: boolean;
  children?: React.ReactNode;
  report: Report;
}

export const ReportPageContainer = ({ children, editMode, isLoading, className, report, ...rest }: Props) => {
  const styles = useStyles2(getStyles);

  useEffect(() => {
    document.title = `Reporting: ${editMode ? 'Edit report' : 'New report'}`;
  }, [editMode]);

  const pageNav = getPageNavInformation({ report, editMode });

  return (
    <Page navId="reports-list" pageNav={pageNav}>
      <Page.Contents>
        <div className={styles.page} {...rest}>
          <CustomScrollbar autoHeightMin={'100%'}>
            {isLoading ? <PageLoader /> : !config.rendererAvailable ? <NoRendererInfoBox variant="error" /> : children}
          </CustomScrollbar>
        </div>
      </Page.Contents>
    </Page>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    page: css`
      height: 100%;
    `,
  };
};
