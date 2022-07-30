import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { NumberVerificationLink } from 'Interface/numberVerification.interface';
import FormHeader from './FormHeader';
import TextInputField from './TextInputField';
import Button from './Button';
import FormErrorMessage from './FormErrorMessage';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';

export default function PhoneNumberVerification() {
  const navigate = useNavigate();
  const numberVerificationSchema = yup.object().shape({
    phoneNumber: yup.string().trim().required('Phone number is required.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NumberVerificationLink>({
    resolver: yupResolver(numberVerificationSchema),
  });
  const auth = getAuth();
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(true);
  const [results, setResults] = useState<any>('');

  const numberVerify = async (value: NumberVerificationLink) => {
    const verify = new RecaptchaVerifier('captcha-container', {}, auth);
    signInWithPhoneNumber(auth, value.phoneNumber, verify)
      .then((res: any) => {
        setResults(res);
        setShow(true);
        setHide(false);
        toast.success('Otp sent');
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const ValidateOtp = (value: NumberVerificationLink) => {
    results
      .confirm(value.otp)
      .then((res: any) => {
        const user = res.user;
        console.log(user);
        toast.success('Verify successfully');
        navigate(routes.listScreen);
      })
      .catch((err: any) => {
        toast.error('Wrong otp');
        console.log(err.message);
      });
  };

  return (
    <>
      <div>
        <FormHeader />
      </div>
      <ToastContainer />
      {hide && (
        <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-md w-full space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-extrabold text-gray-900'>Verify Your Number</h2>
              <p className='mt-2'>Please enter your phone number</p>
            </div>
            <form className='mt-8 space-y-4' onSubmit={handleSubmit(numberVerify)}>
              <div className='rounded-md -space-y-px'>
                <div>
                  <TextInputField type='text' placeholder='Phone number' register={register('phoneNumber')} />
                </div>
                <div id='captcha-container' className='pt-4'></div>
              </div>
              <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>

              <div>
                <Button>Send</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {show && (
        <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <form onSubmit={handleSubmit(ValidateOtp)}>
            <div className='max-w-md w-full space-y-8'>
              <TextInputField type='text' placeholder={'Enter your OTP'} register={register('otp')} />
              <Button>Verify</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
