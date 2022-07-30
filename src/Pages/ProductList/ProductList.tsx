/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import faker from '@faker-js/faker';

import ProductListHeader from 'Components/ProductListHeader';
import { routes } from 'routes';
import { Link, useNavigate } from 'react-router-dom';
import { BiLeftArrowAlt, BiRightArrowAlt, BiRupee } from 'react-icons/bi';
import StarRating from 'Components/StarRating';
import Button from 'Components/Button';
import 'Styles/product-list-header.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Store/store';
import { cartSliceAction } from 'Pages/Reducer/CartSlice';
import { ICart } from 'Interface/cart.interface';
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import db from 'lib/firebase';
import { ProductListItem } from 'Interface/product-list-item.interface';
import { Products } from 'Interface/productinterface';


export default function ProductList() {

  const [product, setProduct] = useState<ProductListItem[]>();
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState<ProductListItem[]>();
  const cart = useSelector((state: RootState) => state.cart.cartItem);




  const searchItems = (searchValue:any) => {
    setSearchInput(searchValue);
  const filteredData = product && product.filter((item) => {
    return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase());
    });
    console.log(filteredData);
    setFilteredResults(filteredData);

};



  // Get Quantity
  const cartQuantity = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  //Add to cart button function
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

  // fetching Product detail from
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
      <div className='container mx-auto'>
        <div className='flex justify-center relative'>
          <div className='font-bold md:text-4xl sm:text-xl mt-10'>Products</div>

          {/* Only visible for admin */}
          <div className='absolute right-6 mt-10'>
            <Link to={routes.productListForm}>
              <Button>Add new</Button>
            </Link>
          </div>
          {/* Only visible for admin end */}
        </div>
        <div className='text-black lg:pr-6 md:pr-6 sm:mr-4 sm:pl-2 search-input'>
            <input onChange = {(e) => searchItems(e.target.value)}/>
          </div>

        <div className='mt-10 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center p-4'>
          {searchInput.length > 1 ? (
            filteredResults && filteredResults.map((el) => {
              console.log(filteredResults);

              return (
                <div className='max-w-sm rounded-2xl overflow-hidden shadow hover:shadow-lg' key={el.id}>
                  <Link to={`/productDetailsScreen/${el.id}`}>
                    {' '}
                    <img className='w-full' src={el.image} alt='image' />
                    <div className='px-6 py-2'>
                      <div className='font-bold text-xl mb-2'>{el.title}</div>
                      <p className='text-gray-700 text-base'>{el.descriptions}....</p>
                    </div>
                  </Link>

                  <div className='px-4 pt-4 pb-2 flex text-sm font-semibold text-gray-700'>
                    <span className='px-3 py-1 mr-2 mb-2 flex'>
                      Price : <BiRupee className='mt-1' /> {el.actualPrice}
                    </span>
                    <div className='flex'>
                      <span className='px-3 py-1 mb-2'>Category:</span>
                      <div className='mt-2'>
                        {el.category}
                      </div>
                    </div>
                  </div>

                  <div className='pb-10 flex justify-around'>
                    <Button onClick={() => handelAddToCart(el, el.id)}>
                      ADD to Cart
                    </Button>
                    <Button onClick={() => handelBuyNow(el, el.id)}>Buy Now</Button>
                  </div>
                </div>

              );
            })) : (
            product && product.map((el) => {

              return (
                <div className='max-w-sm rounded-2xl overflow-hidden shadow hover:shadow-lg' key={el.id}>
                  <Link to={`/productDetailsScreen/${el.id}`}>
                    {' '}
                    <img className='w-full' src={el.image} alt='image' />
                    <div className='px-6 py-2'>
                      <div className='font-bold text-xl mb-2'>{el.title}</div>
                      <p className='text-gray-700 text-base'>{el.descriptions}....</p>
                    </div>
                  </Link>

                  <div className='px-4 pt-4 pb-2 flex text-sm font-semibold text-gray-700'>
                    <span className='px-3 py-1 mr-2 mb-2 flex'>
                      Price : <BiRupee className='mt-1' /> {el.actualPrice}
                    </span>
                    <div className='flex'>
                      <span className='px-3 py-1 mb-2'>Category:</span>
                      <div className='mt-2'>
                        {el.category}
                      </div>
                    </div>
                  </div>

                  <div className='pb-10 flex justify-around'>
                    <Button onClick={() => handelAddToCart(el, el.id)}>
                      ADD to Cart
                    </Button>
                    <Button onClick={() => handelBuyNow(el, el.id)}>Buy Now</Button>
                  </div>
                </div>

              );
            })
          )}
        </div>
        <div className='mt-10 mb-10 text-center flex justify-center text-xl'>
          <BiLeftArrowAlt className='mt-1 mr-2' /> 1 {''} 2 {''} 3{''} 4{''} <BiRightArrowAlt className='mt-1 ml-2' />
        </div>
      </div>
    </>
  );
}














