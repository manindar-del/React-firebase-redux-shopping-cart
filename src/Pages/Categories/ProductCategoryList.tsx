import React from 'react';
import faker from '@faker-js/faker';

import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

export default function ProductCategoryList() {
  const categories = [...Array(15)].map(() => ({
    id: faker.datatype.uuid(),
    productName: faker.commerce.productName(),
    image: faker.image.business(600, 400),
    description: faker.lorem.words(4),
  }));

  return (
    <>
      <div className='container mx-auto'>
        <div className='font-bold md:text-4xl sm:text-xl mt-10 mb-10 text-center'>Products Categories</div>
        <div className='mt-10 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
          {categories.map((el) => {
            return (
              <div className='max-w-sm rounded-2xl overflow-hidden shadow hover:shadow-lg' key={el.id}>
                  <img className='w-full' src={el.image} alt='image' />
                  <div className='px-6 py-2'>
                    <div className='font-bold text-xl mb-2'>{el.productName}</div>
                    <p className='text-gray-700 text-base'>{el.description}....</p>
                  </div>
              </div>
            );
          })}
        </div>
        <div className='mt-10 mb-10 text-center flex justify-center text-xl'>
          <BiLeftArrowAlt className='mt-1 mr-2' /> 1 {''} 2 {''} 3{''} 4{''} <BiRightArrowAlt className='mt-1 ml-2' />
        </div>
      </div>
    </>
  );
}

