import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from 'Store/store';

import { routes } from 'routes';

export default function UnAuthGuard() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user === null) {
    return <Outlet />;
  } else if (user?.uid) {
    return <Navigate to={routes.listScreen} />;
  } else {
    return <>... loading </>;
  }
}
