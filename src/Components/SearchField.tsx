import { useEffect, useState } from 'react';

import iconMagnify from 'assets/icons/icon_magnify.svg';
import '../Styles/product-list-header.css';

export function SearchField({
  onSearch,
  label,
  defaultValue,
}: {
  onSearch?: (v: string) => void;
  defaultValue?: string;
  label?: string;
}): JSX.Element {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    } else {
      setValue('');
    }
  }, [defaultValue]);

  return (
    <div className='inline-block relative'>
      {!focused && value.length === 0 && (
        <label
          className='absolute flex left-2 -translate-y-1/2 transform 
          top-1/2 text-primary opacity-70 pointer-events-none'>
          <img src={iconMagnify} alt='magnify' className='mr-2' />
          {label ? label : 'Search'}
        </label>
      )}
      <input
        className='py-1 px-4 lg:w-96 md:w-64 sm:w-52 focus:outline-none rounded-lg 
          border-gray-300 focus:border-indigo-400 search'
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          if (onSearch) {
            onSearch(v);
          }
        }}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        value={value}
      />
    </div>
  );
}
