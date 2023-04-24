import { config, featureEnabled, registerEchoBackend } from '@grafana/runtime';
import { getConfig } from 'app/core/config';
import { contextSrv } from 'app/core/services/context_srv';

import { initAnalyticsDrawer } from './AnalyticsDrawer/AnalyticsDashNav';
import { MetaAnalyticsBackend } from './MetaAnalyticsBackend';
import { initPresenceIndicators } from './PresenceIndicators';
import { getPublicDashboardAccessToken } from './utils';

export const initMetaAnalytics = () => {
  if (featureEnabled('analytics')) {
    registerEchoBackend(new MetaAnalyticsBackend({ url: getMetaAnalyticsUrl() }));

    const user = contextSrv.user;
    if (user.isSignedIn) {
      initPresenceIndicators();
      initAnalyticsDrawer();
    }
  } else if (config.featureToggles.featureHighlights) {
    initAnalyticsDrawer();
  }
};

const getMetaAnalyticsUrl = () => {
  return getConfig().isPublicDashboardView
    ? `api/public/ma/events/${getPublicDashboardAccessToken()}`
    : 'api/ma/events';
};
