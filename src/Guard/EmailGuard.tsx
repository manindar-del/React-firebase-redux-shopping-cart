import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from 'Store/store';

import { routes } from 'routes';

export default function EmailGuard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

    if (user === null) {
      navigate(routes.login);
    } else if (user?.uid && user.emailVerified) {
      navigate(routes.listScreen);
    } else {
      return <Outlet />;
    }

  return <div />;
}
