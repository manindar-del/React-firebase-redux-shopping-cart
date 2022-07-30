
  
/* eslint-disable max-len */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

import { SignIn } from 'Interface/login.interface';
import FormHeader from 'Components/FormHeader';
import Button from 'Components/Button';
import TextInputField from 'Components/TextInputField';
import { routes } from 'routes';
import FormErrorMessage from 'Components/FormErrorMessage';
import { fireAuth } from 'lib/firebase';
import SignInLinkButton from 'Components/SigninLinkButton';
import { FcGoogle, FcPhoneAndroid } from 'react-icons/fc';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const loginSchema = yup.object().shape({
    email: yup.string().trim().required('Email address is required.').email('Please enter your email address.'),
    password: yup.string().trim().required('Password is required.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignIn>({
    resolver: yupResolver(loginSchema),
  });
  const onSubmit = async (value: SignIn) => {
    try {
      const authUser = await signInWithEmailAndPassword(fireAuth, value.email, value.password);
      if (authUser.user.emailVerified === true) {
        navigate(routes.listScreen);
      } else if (authUser.user.emailVerified === false) {
        navigate(routes.emailVerification);
      }
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setErrorMessage('Invalid password');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Email not found');
      } else {
        setErrorMessage(error.message);
      }
    }
  };
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const googleLogin = async () => {
    try {
      const results = signInWithPopup(auth, provider);
      console.log(results);
      navigate(routes.listScreen);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div>
        <FormHeader />
      </div>
      <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-2'>
          <div>
            <h2 className='text-center text-3xl font-extrabold text-gray-900'>Sign in to your account</h2>
          </div>
          <form className='mt-8 space-y-2' onSubmit={handleSubmit(onSubmit)}>
            <div className='rounded-md -space-y-px'>
              {/* Email  */}
              <div className='mb-2'>
                <TextInputField type='email' placeholder='Email' register={register('email')} />
              </div>
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              {/* Email End  */}

              {/* Password  */}
              <div>
                <TextInputField type='password' placeholder='Password' register={register('password')} />
              </div>
              <div className='pt-2'>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </div>
              {/* Password End  */}
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                />
                <label className='ml-2 block text-sm text-gray-900'>Remember me</label>
              </div>

              <div className='text-sm'>
                <Link to={routes.forgetPassword} className='font-medium text-indigo-600 hover:text-indigo-800'>
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className='flex justify-center'>
              <Button>Login</Button>
            </div>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </form>

          {/* Sign in button */}
          <SignInLinkButton onClick={googleLogin}>
            {' '}
            <div className='text-2xl mr-2'>
              <FcGoogle />
            </div>
            Sign in with Google
          </SignInLinkButton>
          <div>
            <Link to={routes.phoneNumberVerification}>
              <SignInLinkButton>
                <div className='text-2xl mr-2'>
                  <FcPhoneAndroid />
                </div>
                Sign in with mobile number
              </SignInLinkButton>
            </Link>
          </div>
          {/* Sign in button end */}

          <div className='text-center'>
            Do not have an account?{' '}
            <Link to={routes.registration} className='text-blue-600 hover:text-blue-800'>
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
