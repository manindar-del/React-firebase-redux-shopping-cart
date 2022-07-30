import React from 'react';
import Header from '../../../Components/AuthHeader';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResetPassword } from '../../../Interface/resetpassword.interface';
import TextInputField from '../../../Components/TextInputField';
import Button from '../../../Components/Button';
import FormErrorMessage from '../../../Components/FormErrorMessage';

export default function PasswordReset() {

  const resetPasswordSchema = yup.object().shape({
    password: yup.string().required().min(4),
    confirmPassword: yup.string().required().oneOf([yup.ref('password')], 'Passwords must match'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassword>({
    resolver: yupResolver(resetPasswordSchema) as unknown as any,
  });
  const onSubmit = (data: ResetPassword) => {
    console.log(data);
    alert('Password is successfully reset');
  };
  return (
  <>
   <div>
    <Header/>
    </div>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md -space-y-px">
              <div className='pb-3'>
                <TextInputField
                  type="password"
                  placeholder="Password"
                  register={register('password')}
                />
              </div>
              <div>
                 {errors.password?.type === 'required' && (
                <FormErrorMessage>Password is required.</FormErrorMessage>
              )}
               {errors.password?.type === 'min' && (
                <FormErrorMessage>Password must be at least 4 characters</FormErrorMessage>
              )}
              </div>
              <div>
                <TextInputField
                  type="password"
                  placeholder="Confirm Password"
                  register={register('confirmPassword')}
                />
              </div>
              <div>
              {errors.confirmPassword?.type === 'required' && (
                <FormErrorMessage>Confirm Password is required.</FormErrorMessage>
              )}
               {errors.confirmPassword?.type === 'oneOf' && (
                <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
              )}
              </div>
            </div>

            <div>
             <Button>Reset</Button>
            </div>
          </form>
      </div>
      </div>
      </>
  );
}
