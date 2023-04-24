import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAsync } from 'react-use';

import { AppEvents } from '@grafana/data';
import { config, getBackendSrv, locationService } from '@grafana/runtime';
import { Button } from '@grafana/ui';
import { ErrorPage } from 'app/core/components/ErrorPage/ErrorPage';
import { Page } from 'app/core/components/Page/Page';
import { appEvents, contextSrv } from 'app/core/core';

import { AccessControlAction, BrandingOptions } from '../types';

import { NoRendererInfoBox } from './RenderingWarnings';
import ReportBranding from './ReportBranding';

export const ReportsSettingsPage = () => {
  const {
    value: settings,
    loading,
    error,
  } = useAsync(async () => {
    const settings = await getBackendSrv().get('/api/reports/settings');
    // Update default settings after loading
    reset(settings.branding);
    return settings;
  });

  const { handleSubmit, reset, ...formMethods } = useForm({ mode: 'onBlur', defaultValues: settings?.branding });

  const submitForm = (branding: BrandingOptions) => {
    const formData = new FormData();

    for (const [field, value] of Object.entries(branding)) {
      if (value instanceof File) {
        branding = { ...branding, [field]: value.name };
        formData.append('files', value);
      }
    }
    formData.append('config', JSON.stringify({ branding }));

    return fetch('/api/reports/settings', { method: 'POST', body: formData }).then((response) => {
      if (response.ok) {
        appEvents.emit(AppEvents.alertSuccess, ['Successfully saved configuration']);
        locationService.push('/reports');
      } else {
        appEvents.emit(AppEvents.alertError, ['Error saving configuration', response.statusText]);
      }
    });
  };

  if (error) {
    return <ErrorPage />;
  }

  const canEditSettings = contextSrv.hasPermission(AccessControlAction.ReportingSettingsWrite);

  return (
    <Page navId="reports-settings" subTitle="Manage report template settings.">
      <Page.Contents isLoading={loading}>
        {!config.rendererAvailable ? (
          <NoRendererInfoBox variant="error" />
        ) : (
          <FormProvider {...formMethods} reset={reset} handleSubmit={handleSubmit}>
            <form onSubmit={handleSubmit(submitForm)} style={{ maxWidth: '500px' }}>
              <ReportBranding />
              <Button type="submit" size="md" variant="primary" disabled={!canEditSettings}>
                Save
              </Button>
            </form>
          </FormProvider>
        )}
      </Page.Contents>
    </Page>
  );
};
