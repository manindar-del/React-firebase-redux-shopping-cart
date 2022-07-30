import { ReactNode } from 'react';

export default function Button({
  type,
  children,
  onClick,
}: {
  children?: ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  return (
    <button
      type={type ? type : 'submit'}
      onClick={onClick ? () => onClick() : () => {}}
      className='relative flex justify-center py-2 px-4 border
        border-transparent text-sm font-medium rounded-md text-white bg-indigo-600
         hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
         focus:ring-indigo-500'>
      {children}
    </button>
  );
}
