import Button from 'Components/Button';
import TextInputField from 'Components/TextInputField';
import React from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { AiFillLock } from 'react-icons/ai';

export default function UserProfile() {
  
  return (
    <>
      <body className='bg-gray-100 p-10'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6'>
          <div className='bg-white'>
            <header className='p-6 flex items-stretch border-b border-gray-100'>
              <p className='flex-grow font-bold flex'>
                <span className='mt-1 mr-2'>
                  <FaUserAlt />
                </span>
                Edit Profile
              </p>
            </header>
            <div className='card-content p-6'>
              <form>
                <div className='field'>
                  <div className='flex'>
                    <input type='file' />
                    <div>
                      <Button>Upload Image</Button>
                    </div>
                  </div>
                </div>
                <hr className='my-6 -mx-6' />
                <div className='field'>
                  <label className='pr-4 font-semibold'>Name</label>
                  <div className='pb-2 pt-2'>
                    <TextInputField value='Rimpa Das' placeholder='Enter your name' type='text' />
                  </div>
                </div>
                <div className='field'>
                  <label className='pr-4 font-semibold'>E-mail</label>
                  <div className='field'>
                    <div className='pb-2 pt-2'>
                      <TextInputField value='rimpa@itobuz.com' placeholder='Enter your email' type='text' />
                    </div>
                  </div>
                </div>
                <div className='field'>
                  <Button>
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div className='card bg-white'>
          <header className='p-6 flex items-stretch border-b border-gray-100'>
              <p className='flex-grow font-bold flex'>
                <span className='mt-1 mr-2'>
                  <FaUserAlt />
                </span>
                Profile
              </p>
            </header>
            <div className='card-content p-6'>
              <div className=' block relative w-48 h-48 mx-auto'>
                <img
                  src='https://avatars.dicebear.com/v2/initials/john-doe.svg'
                  alt='image'
                  className='rounded-full p-2'
                />
              </div>
              <hr />
              <div className='field p-2'>
                <label className='font-semibold'>Name</label>
               <div>Rimpa Das</div>
              </div>
              <hr />
              <div className='field p-2'>
                <label className='font-semibold'>Email</label>
               <div>rimpa@itobuz.com</div>
              </div>
            </div>
          </div>
        </div>
        <div className='card bg-white p-6'>
        <header className='p-2 flex items-stretch border-b border-gray-100'>
              <p className='flex-grow font-bold flex'>
                <span className='mt-1 mr-2'>
                  <AiFillLock />
                </span>
                Change Password
              </p>
            </header>
         
          <div className='card-content'>
            <form>
              <div className='field p-2'>
                <label className='font-semibold'>Current password</label>
                <div className='p-2'>
                  <TextInputField
                    type='password'
                    placeholder='enter current password'
                  />
                </div>
              </div>
              <div className='field p-2'>
                <label className='font-semibold'>New password</label>
                <div className='p-2'>
                  <TextInputField type='password' placeholder='enter new password'  />
                </div>
              </div>
              <div className='field'>
                <label className='font-semibold'>Confirm password</label>
                <div className='p-2'>
                  <TextInputField
                    type='password'
                   placeholder='enter new password again'
                  />
                </div>
              </div>
              <div className='field'>
              <Button>Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </body>
    </>
  );
}
