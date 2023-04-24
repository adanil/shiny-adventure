import { getConfig } from 'app/core/config';

export function getPublicDashboardAccessToken() {
  const config = getConfig();
  if (config.isPublicDashboardView) {
    const paths = window.location.pathname.split('/');

    return paths[paths.length - 1];
  }

  return '';
}
