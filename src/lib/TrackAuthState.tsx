/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth } from './firebase';
import { useDispatch } from 'react-redux';
import { authActions } from 'Store/slice/authSlice';

export default function TrackAuthState() {
  const dispatch = useDispatch();

useEffect(() => {
  onAuthStateChanged(fireAuth, (user) => {
   console.log(user);
   if (user) {
    dispatch(authActions.updateAuthState(user?.toJSON()));
   } else {
    dispatch(authActions.updateAuthState(null));
   }
   
  });
}, []);

  return (
    <div></div>
  );
}
