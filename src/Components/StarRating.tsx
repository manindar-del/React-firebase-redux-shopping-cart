import _ from 'lodash';
import React from 'react';

import Star from './Star';

export default function StarRating({ rating } : { rating?: number } ) {

  return (
    <div className='relative'>
      {_.range(0, 5).map((n) => {
        return (
          <button
            type='button'
            key={n}
            className='mr-1 text-gray-400'>
            <Star />
          </button>
        );
      })}
      <div className='absolute left-0 top-0'>
      {_.range(0, rating).map((n) => {
        return (
          <button
            type='button'
            key={n}
            className='mr-1 text-yellow-500'>
            <Star />
          </button>
        );
      })}
      </div>
    </div>
  );
}
