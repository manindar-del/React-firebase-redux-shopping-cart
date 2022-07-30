import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'Store/store';

import { routes } from 'routes';

export default function HomePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (user === null) {
      navigate(routes.login);
    } else if (user?.uid && user.emailVerified) {
      navigate(routes.listScreen);
    } else {
      navigate(routes.emailVerification);
    }
  }, [user, navigate]);

  return <div>Home Page</div>;
}
