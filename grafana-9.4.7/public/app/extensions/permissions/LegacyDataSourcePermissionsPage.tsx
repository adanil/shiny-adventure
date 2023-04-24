import React from 'react';
import { useParams } from 'react-router-dom';

import { Page } from 'app/core/components/Page/Page';
import { getNavModel } from 'app/core/selectors/navModel';
import { getDataSourceLoadingNav } from 'app/features/datasources/state/navModel';
import { StoreState, useSelector } from 'app/types';

import LegacyDataSourcePermissions from './LegacyDataSourcePermissions';

// The legacy (non-RBAC) version of the data source permissions page
export const LegacyDataSourcePermissionsPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const dataSourceLoadingNav = getDataSourceLoadingNav('permissions');
  const navIndex = useSelector((state: StoreState) => state.navIndex);
  const navModel = getNavModel(navIndex, `datasource-permissions-${uid}`, dataSourceLoadingNav);

  return (
    <Page navId="datasources" pageNav={navModel.main}>
      <Page.Contents>
        <LegacyDataSourcePermissions uid={uid} />
      </Page.Contents>
    </Page>
  );
};
