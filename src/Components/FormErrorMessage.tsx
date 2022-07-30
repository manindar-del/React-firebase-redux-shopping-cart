import { ReactNode } from 'react';

export default function FormErrorMessage({ children }: { children?: ReactNode }) {
  return <>{children ? <div className='text-red-600 text-base pb-2'>{children} </div> : <></>}</>;
}
