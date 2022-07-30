import FormHeader from 'Components/FormHeader';
import React, { useEffect, useState } from 'react';
import { BiRupee } from 'react-icons/bi';
import { UserDetails } from 'Interface/user-details.interface';
import { collection, getDocs } from 'firebase/firestore';
import db from 'lib/firebase';

export default function OrderListScreen() {

const [order, setOrder] = useState<UserDetails[]>([]);
const [orderItem, setOrderItem] = useState<any>();

const fetchData = async () => {
  const q = await getDocs(collection(db, 'checkout'));
  const data = q.docs.map(i => i.data() as UserDetails);
  setOrder(data);

};
useEffect(() => {
  fetchData();
}, []);


// number of items in order list total
useEffect(() => {
  const getOrderItems = collection(db, 'checkout');
  getDocs(getOrderItems).then((item) => {
    const orderItems = item.size;
    setOrderItem(orderItems);
  });
});

  return (
    <>
      <body className='bg-gray-100'>
        <FormHeader />
        <div className='container mx-auto mt-10'>
          <div className='flex shadow-md my-10'>
            <div className='w-full bg-white px-10 py-10'>
              {/* Cart header */}
              <div className='flex justify-between border-b pb-8'>
                <h1 className='font-semibold text-2xl'>Order List</h1>
                <h2 className='font-semibold text-2xl'>{orderItem} Items</h2>
              </div>
              {/* Cart header end */}

              {/* cart list header */}
              <div className='flex mt-10 mb-5'>
                <h3 className='font-semibold text-gray-600 text-xs uppercase w-1/5'>Customer Name</h3>
                <h3 className='font-semibold text-gray-600 text-xs uppercase w-1/5'>Customer Address</h3>
                <h3 className='font-semibold text-gray-600 text-xs uppercase w-1/5'>Product Name</h3>
                <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5 pr-10'>Purchase Date</h3>
                <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>Quantity</h3>
                <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>Total</h3>
              </div>
              {/* cart list header end */}

              {/* cart list item */}
              {order && order.map((el) => {
                return (
              <div className='flex items-center hover:bg-gray-100 -mx-8 px-6 py-5'>
                <div className='flex w-1/5'>
                  <div className='flex flex-col justify-between ml-4 flex-grow'>
                    <span className='font-bold text-sm'>{el.name}</span>
                  </div>
                </div>
                <div className='flex w-1/5'>
                  <div className='flex flex-col justify-between ml-4 flex-grow'>
                    <span className='font-bold text-sm'>{el.address}</span>
                  </div>
                </div>
                <div className='flex w-1/5'>
                  <div className='flex flex-col justify-between ml-4 flex-grow'>
                    <span className='font-bold text-sm'>{el.name}</span>
                  </div>
                </div>
                <div className='flex w-1/5 pl-6'>
                  <div className='flex flex-col justify-between ml-4 flex-grow'>
                    <span className='font-bold text-sm'>{el.order_date}</span>
                  </div>
                </div>

                {/* Quantity section */}
                <div className='flex justify-center w-1/5'>
                  <input className='mx-2 border text-center w-8' type='text' value= {el.quantity}/>
                </div>
                {/* Quantity section end */}

                {/* Price section */}
                <span className='text-center w-1/5 font-semibold text-sm'>
                  <BiRupee className='absolute ml-14 mt-1' />
                  {el.total}
                </span>
              </div>
              /* Price section end */
              );
            })}
            </div>
          </div>
        </div>
      </body>
    </>
  );
}
