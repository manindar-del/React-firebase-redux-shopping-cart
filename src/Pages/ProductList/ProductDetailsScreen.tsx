import faker from '@faker-js/faker';
import StarRating from 'Components/StarRating';
import React, { useEffect, useState } from 'react';
import { BiRupee } from 'react-icons/bi';
import { MdLocalOffer } from 'react-icons/md';
import { routes } from 'routes';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Button from '../../Components/Button';
import ProductListHeader from 'Components/ProductListHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store/store';
import { cartSliceAction } from 'Pages/Reducer/CartSlice';
import { collection, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { doc } from 'firebase/firestore';
import db from 'lib/firebase';
import { ProductListItem } from 'Interface/product-list-item.interface';


export default function ProductDetailsScreen() {
  const param = useParams();
  const cartQuantity = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductListItem[]>();
  const [productValue, setProductValue] = useState<ProductListItem | any>();


  //Add to cart button
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handelAddToCart = async (product: any, id: string) => {
    dispatch(cartSliceAction.addToCart({ ...product, id }));
    const generateId = uuidv4();
    await setDoc(doc(db, 'cartItem', generateId), {
      id: generateId,
      quantity: cartQuantity.quantity + 1,
      product_id: id,
    });
  };

//Buy Now button
// eslint-disable-next-line @typescript-eslint/no-shadow
  const handelBuyNow = async (product: any, id: string) => {
    const generateId = uuidv4();
    await setDoc(doc(db, 'cartItem', generateId), {
      id: generateId,
      quantity: cartQuantity.quantity + 1,
      product_id: id,
    });
    navigate(routes.checkoutScreen);
  };


// fetching product  from firebase using id
  useEffect(() => {
    (async () => {
      const id = param.id;
      if (id) {
        const productRef = doc(db, 'productForm', id);
        const productData = await getDoc(productRef);
        const products = productData.data() as any;
        setProductValue(products);
      }
    })();
  }, [param.id, setProductValue]);



  // fetching Product detail from firebase
  const fetchData = async () => {
    const q = await getDocs(collection(db, 'productForm'));
    const data = q.docs.map(i => i.data() as ProductListItem);
    setProduct(data);

  };
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <>
      <ProductListHeader />
      <body className='bg-gray-100 p-6'>
        <div className='flex justify-center'>
          <div className='font-bold md:text-4xl sm:text-xl mb-6 '>Products Details</div>

         
        </div>
        {/* Only visible for admin end */}

        {/* product details */}

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6'>
          <div className='bg-white'>
            <div className='card-content p-6'>
              
                  <><div className=' block relative md:w-96 sm:w-48 h-96 mx-auto'>
                    <img src={productValue?.image} alt='image' className='p-2' />
                  </div><div className='flex justify-around mt-4'>
                      <Button onClick={() => handelAddToCart(product, productValue?.id)}>ADD TO CART</Button>
                      <Button onClick={() => handelBuyNow(product, productValue?.id)}>BUY NOW</Button>
                    </div></>
            </div>
          </div><div className='card bg-white'>
              <div className='card-content p-6'>
                <div className='field p-2'>
                  <div className='font-bold md:text-3xl sm:text-xl mb-2'>{productValue?.title}</div>
                  {/* <div className='mt-2'>
                     <StarRating rating={el.rating} />
                      </div> */}
                  <div>
                    {' '}
                    <span className='mb-3 flex font-semibold'>
                      Price: <BiRupee className='mt-1' /> {productValue?.actualPrice}
                    </span>
                  </div>
                  <div>
                    <div className='font-semibold text-xl mb-2'>Available offers</div>
                    <div className='flex'>
                      <div className='mt-1 mr-2 text-green-600'>
                        <MdLocalOffer />
                      </div>
                      <div className='mb-4'>
                        <span className='font-semibold'>Bank Offer</span>
                        10% off on SBI Credit Card, up to ₹750. On orders of ₹5000 and above
                        <span className='text-blue-500 ml-2'>T&C</span>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='mt-1 mr-2 text-green-600'>
                        <MdLocalOffer />
                      </div>
                      <div>
                        <span className='font-semibold'>Bank Offer</span>
                        10% off on SBI Credit Card EMI transactions, up to ₹1000. On orders of ₹5000 and above
                        <span className='text-blue-500 ml-2'>T&C</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-gray-700 text-base mt-4'>{productValue?.descriptions}</div>
                </div>
              </div>
            </div>

        </div>

        {/* product details end */}

        {/* relate products */}
        
            <div className='container mx-auto'>
              <div className='flex justify-center'>
                <div className='font-bold md:text-4xl sm:text-xl mt-4'>Related Products</div>
              </div>
              <div className='mt-6 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {product && product.map((el) => {
               return (
    
                    <div className='max-w-sm rounded-2xl overflow-hidden shadow hover:shadow-lg'>
                      <img className='w-full' src={el.image} alt='image' />
                      <div className='px-6 py-2'>
                        <div className='font-bold text-xl mb-2'>{el.title}</div>
                      </div>

                      <div className='px-4 pb-4 text-sm font-semibold text-gray-700'>
                        <span className='px-3 py-1 mr-2 mb-2 flex'>
                          Price : <BiRupee className='mt-1' /> {el.actualPrice}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* relate products end */}
         
      </body>
    </>
  );
}
