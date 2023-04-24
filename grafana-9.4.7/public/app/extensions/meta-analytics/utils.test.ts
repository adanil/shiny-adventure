import { updateConfig } from 'app/core/config';

import { getPublicDashboardAccessToken } from './utils';

describe('Meta analytics utils', () => {
  it('should parse access token from url when viewing a public dashboard', () => {
    updateConfig({ isPublicDashboardView: true });
    const accessToken = '1ceb13cd630d4e03a1d6a9254514c674';

    // @ts-ignore
    delete window.location;
    window.location = {
      ...window.location,
      pathname: `/public-dashboards/${accessToken}`,
    };

    expect(getPublicDashboardAccessToken()).toBe(accessToken);
  });

  it('it will return empty string when not viewing a public dashboard', () => {
    updateConfig({ isPublicDashboardView: false });

    // @ts-ignore
    delete window.location;
    window.location = {
      ...window.location,
      pathname: '/some/other/path',
    };

    expect(getPublicDashboardAccessToken()).toBe('');
  });
});
