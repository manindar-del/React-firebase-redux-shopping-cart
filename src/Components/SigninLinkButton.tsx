import { ReactNode } from 'react';

export default function SignInLinkButton({
  type,
  children,
  onClick,
}: {
  children?: ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  return (
    <>
      <div>
        <button
          type={type ? type : 'submit'}
          onClick={onClick ? () => onClick() : () => {}}
          className='relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md bg-gray-200
         hover:bg-gray-300'>
          {children}
        </button>
      </div>
    </>
  );
}
