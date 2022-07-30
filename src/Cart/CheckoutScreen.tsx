/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from 'Components/Button';
import FormErrorMessage from 'Components/FormErrorMessage';
import TextInputField from 'Components/TextInputField';
import { UserDetails } from 'Interface/user-details.interface';
import { routes } from 'routes';
import { Link } from 'react-router-dom';
import FormHeader from 'Components/FormHeader';
import { BiRupee } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { RootState } from 'Store/store';
import { collection, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import db, { fireAuth } from 'lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged } from 'firebase/auth';
import { rowCartItem, SingleCartItem } from 'Interface/cartitem.interface';
import { ProductListItem } from 'Interface/product-list-item.interface';


export default function CheckoutScreen() {
  const UserDetailsSchema = yup.object().shape({
    name: yup.string().trim().required('Name is required.'),
    email: yup.string().trim().required('Email address is required').email('Enter valid email address'),
    phoneNumber: yup.string().trim().required('Phone number is required.'),
    address: yup.string().trim().required('Address is required.'),
    country: yup.string().trim().required('Country is required.'),
    city: yup.string().trim().required('city is required.'),
    pinCode: yup.string().trim().required('PinCode is required.'),
   
  });

  const cartQuantity = useSelector((state: RootState) => state.cart);
  const cart = useSelector((state: RootState) => state.cart.cartItem);
  //userId
  const userId = useSelector((state: RootState) => state.auth.user);

  const [carts, setCarts] = useState<rowCartItem[]>([]);
  const [itemsTotal, setItemsTotal] = useState<any>();



  // items number in order summary section
  const cartItemsCount = carts.reduce(
    (accumulator: number, current: { quantity: number }) =>
      accumulator + current.quantity,
    0
  );

  //TotalPrice
  const amount = carts.reduce((acc, item) => acc + item.quantity * item.actualPrice, 0).toFixed(2);

  //shopping Charge Add Amount
  const shoppingChargeAddAmount = carts.reduce((acc, item) => acc + item.quantity * item.actualPrice + 40, 0).toFixed(2);

  // Order Date
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDetails>({
    resolver: yupResolver(UserDetailsSchema),
  });

// Number of items  in  order summary section

useEffect(() => {
  const getItems = collection(db, 'cartItem');
  getDocs(getItems).then((item) => {
    const itemsCount = item.size;
    setItemsTotal(itemsCount);
  });
});


// Product details

const findData = async () => {
  const q = query(collection(db, 'cartItem'));
  const cartQueryData = await getDocs(q);
  const cartData = cartQueryData.docs.map(async (i) => {
    const item = i.data() as SingleCartItem;

    const productRef = doc(db, 'productForm', item.product_id);
    const productSnap = await getDoc(productRef);

    const productData = productSnap.data() as ProductListItem;

    return {
      ...item,
      title: productData.title,
      actualPrice: productData.actualPrice || 0,
      totalAmount: productData.actualPrice * item.quantity,
    };
  });
  const data = await Promise.all(cartData);
  setCarts(data);
};


useEffect(() => {
  findData();
}, []);


  const onSubmit = async (data: UserDetails) => {

    const generateId = uuidv4();
    await setDoc(doc(db, 'checkout', generateId), {
      id: generateId,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      country: data.country,
      city: data.city,
      pinCode: data.pinCode,
      saveDetails: data.saveDetails,
      total: amount,
      order_date: date,
      userId:userId?.uid,
      quantity: cartItemsCount,
     
    });

    alert('Form successfully submit');
  };

  return (
    <>
      <FormHeader />
      <div className='min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-2 pr-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-6'>
            <div className='rounded-md -space-y-px'>
              <div className='pb-4 font-medium'>Contact Information</div>

              {/* Email  */}
              <div className='pb-3'>
                <TextInputField type='email' placeholder='Email address' register={register('email')} />
              </div>
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              {/* Email End */}

              {/* Phone number  */}
              <div className='pb-3'>
                <TextInputField type='text' placeholder='Phone number' register={register('phoneNumber')} />
              </div>
              <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
              {/* Phone number End  */}

              <div className='pb-4 font-medium'>Shipping Address</div>

              {/* Name  */}
              <div className='pb-3'>
                <TextInputField type='text' placeholder='Full name' register={register('name')} />
              </div>
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              {/* Name End  */}

              {/* Address  */}
              <div>
                <TextInputField type='text' placeholder='Address' register={register('address')} />
              </div>
              <div className='pt-2'>
                <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
              </div>
              {/* Address End  */}

              {/* country  */}
              <div>
                <TextInputField type='text' placeholder='country' register={register('country')} />
              </div>
              <div className='pt-2'>
                <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
              </div>
              {/* country End  */}


              {/* City  */}
              <div>
                <TextInputField type='text' placeholder='city' register={register('city')} />
              </div>
              <div className='pt-2'>
                <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
              </div>
              {/* City End  */}


              {/* PinCode  */}
              <div>
                <TextInputField type='text' placeholder='PinCode' register={register('pinCode')} />
              </div>
              <div className='pt-2'>
                <FormErrorMessage>{errors.pinCode?.message}</FormErrorMessage>
              </div>
              {/* PinCode End  */}


              <div className='flex items-center pt-2'>
                <input
                  type='checkbox'{...register('saveDetails')}
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                />
                <label className='ml-2 block text-sm text-gray-900'>Save this information for next time</label>
              </div>
            </div>
            <Button>Continue</Button>
          </form>
          <Button>
            <Link to={routes.cartItem}>Back to Cart</Link>
          </Button>
        </div>
        {/*Order summary section */}

        <div className='w-1/4 px-8'>
          <h1 className='font-semibold text-2xl border-b pb-8'>Order Summary</h1>
          <div className='flex justify-between mt-10 mb-5'>
            <span className='font-semibold text-sm'>Items: {cartItemsCount}</span>
            <div className='flex'>
              <span className='text-sm mr-4'>
                <BiRupee className='absolute mt-1' />
              </span>
              <span className='font-semibold text-sm'>{amount}</span>
            </div>
          </div>
          <div>


            <div className='flex justify-between mt-10 mb-5'>
              <span className='font-semibold text-sm'>Shipping Charges</span>
              <div className='flex'>
                <span className='text-sm mr-4'>
                  <BiRupee className='absolute mt-1' />
                </span>
                <span className='font-semibold text-sm'>40</span>
              </div>
            </div>

          </div>

          <div className='border-t border-b mt-8'>
            <div className='flex font-semibold justify-between py-6 text-md'>
              <span>Total Payable</span>
              <div className='flex'>
                <span className='text-sm mr-4'>
                  <BiRupee className='absolute mt-1' />
                </span>
                <span className='font-semibold text-sm'>{shoppingChargeAddAmount}</span>
              </div>
            </div>
          </div>

          {/*Order summary section end */}
        </div>
      </div>
    </>
  );
}
