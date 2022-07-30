
import React, { useEffect, useState } from 'react';

import iconMinus from 'assets/icons/icon_minus.svg';
import iconPlus from 'assets/icons/icon_plus.svg';
import { BiRupee } from 'react-icons/bi';
import { routes } from 'routes';
import { Link } from 'react-router-dom';
import FormHeader from 'Components/FormHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store/store';
import { cartSliceAction } from 'Pages/Reducer/CartSlice';
import { collection, deleteDoc, doc, getDoc, getDocs, increment, query, updateDoc } from 'firebase/firestore';
import { ICart } from 'Interface/cart.interface';
import db from 'lib/firebase';
import { rowCartItem, SingleCartItem } from 'Interface/cartitem.interface';
import { ProductListItem } from 'Interface/product-list-item.interface';


export default function CartItem() {

  // cart list
  const cart = useSelector((state: RootState) => state.cart.cartItem);


  // For get Quantity Purpose
  const cartQuantity = useSelector((state: RootState) => state.cart);


  const [carts, setCarts] = useState<rowCartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<any>();
  // TotalPrice 
  const amount = carts.reduce((acc, item) => acc + item.quantity * item.actualPrice, 0).toFixed(2);

  // items number as quantity add in order summary section
  const cartItemsQuantity = carts.reduce(
    (accumulator: number, current: { quantity: number }) =>
      accumulator + current.quantity, 0
  );



  // Remove item
  const handelRemoveToCart = async (id: string) => {
    const result = doc(db, 'cartItem', String(id));
    try {
      const item = await deleteDoc(result);
      setCarts(carts.filter((items) => items.id !== id));

    } catch (error: any) {
      console.log(error.message);
    }
  };

  // Increase quantity
  const handleAddQuantity = async (index: any, id: string) => {
    const cartRef = doc(db, 'cartItem', String(id));
    try {
      const units = await updateDoc(cartRef, {
        quantity: increment(1),
      });

      setCarts(carts.map((item, i) => i === index
        ? { ...item, quantity: item.quantity + 1 }
        : item
      )
      );

    } catch (error: any) {
      console.log(error.message);

    }
  };


  // substract quantity
  const handleSubtractQuantity = async (index: any, id: string) => {
    const cartRef = doc(db, 'cartItem', String(id));
    try {
      await updateDoc(cartRef, {
        quantity: increment(-1),

      });
      setCarts(carts.map((item, i) => i === index
        ? { ...item, quantity: item.quantity - 1 }
        : item
      )
      );
    } catch (error: any) {
      console.log(error.message);
    }

  };



  // Product details through get product_id from  cartItem database from firebase

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


  // number of items in cart list total

  useEffect(() => {
    const getItems = collection(db, 'cartItem');
    getDocs(getItems).then((item) => {
      const itemsCount = item.size;
      setCartTotal(itemsCount);
    });
  });

  return (
    <>
      <body className='bg-gray-100'>
        <FormHeader />
        {cartTotal >= 1 && (
          <div className='container mx-auto mt-10'>
            <div className='flex shadow-md my-10'>
              <div className='w-3/4 bg-white px-10 py-10'>

                {/* Cart header */}
                <div className='flex justify-between border-b pb-8'>
                  <h1 className='font-semibold text-2xl'>Shopping Cart</h1>
                  <h2 className='font-semibold text-2xl'>{cartTotal} Items</h2>
                </div>
                {/* Cart header end */}

                {/* cart list header */}
                <div className='flex mt-10 mb-5'>
                  <h3 className='font-semibold text-gray-600 text-xs uppercase w-2/5'>Products</h3>
                  <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>Quantity</h3>
                  <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>Price</h3>
                  <h3 className='font-semibold text-center text-gray-600 text-xs uppercase w-1/5'>Total</h3>
                </div>
                {/* cart list header end */}

                {/* cart list item */}

                {carts.map((item, index) => {

                  return (
                    <div className='flex items-center hover:bg-gray-100 -mx-8 px-6 py-5'>
                      <div className='flex w-2/5'>
                        <div className='flex flex-col justify-between ml-4 flex-grow'>
                          <span key={item.id} className='font-bold text-sm'>{item.title}</span>
                          <button onClick={() => handelRemoveToCart((String(item?.id)))}>Remove</button>
                        </div>
                      </div>
                      {/* Quantity section */}
                      <div className='flex justify-center w-1/5'>
                        <button onClick={() => handleSubtractQuantity(index, item.id)}>
                          <img src={iconMinus} alt='minus' />
                        </button>

                        <input className='mx-2 border text-center w-8' type='text' value={item.quantity} />

                        <button onClick={() => handleAddQuantity(index, item.id)}>
                          <img src={iconPlus} alt='plus' />
                        </button>
                      </div>
                      {/* Quantity section end */}

                      {/* Price section */}
                      <span className='text-center w-1/5 font-semibold text-sm'>
                        <BiRupee className='absolute ml-12 mt-1' />
                        {item.actualPrice}
                      </span>
                      <span className='text-center w-1/5 font-semibold text-sm'>
                        <BiRupee className='absolute ml-12 mt-1' />
                        {item.quantity * item.actualPrice}
                      </span>
                    </div>

                  );
                 })
                }

                {/* Price section end */}

                <Link to={routes.listScreen}>
                  {' '}
                  <div className='flex font-semibold text-indigo-600 text-sm mt-10'>Continue Shopping</div>
                </Link>
              </div>
              {/*Order summary section */}
              <div className='w-1/4 px-8 py-10'>
                <h1 className='font-semibold text-2xl border-b pb-8'>Order Summary</h1>
                <div className='flex justify-between mt-10 mb-5'>
                  <span className='font-semibold text-sm'>Items {cartItemsQuantity}</span>
                  <div className='flex'>
                    <span className='text-sm mr-4'><BiRupee className='absolute mt-1' /></span>
                    <span className='font-semibold text-sm'>{amount}</span>
                  </div>
                </div>
                <div>
                </div>
                <div className='border-t mt-8'>
                  <div className='flex font-semibold justify-between py-6 text-'>
                    <span>Total Amount</span>
                    <div className='flex'>
                      <span className='text-sm mr-4'><BiRupee className='absolute mt-1' /></span>
                      <span className='font-semibold text-sm'>{amount}</span>
                    </div>
                  </div>
                  <Link to={routes.checkoutScreen}> <button
                    className='bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm 
          text-white uppercase w-full'>
                    Checkout
                  </button></Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </body>
    </>
  );
}




