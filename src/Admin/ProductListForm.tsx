/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ProductListItem } from 'Interface/product-list-item.interface';
import TextInputField from 'Components/TextInputField';
import Button from 'Components/Button';
import FormErrorMessage from 'Components/FormErrorMessage';
import AuthHeader from 'Components/FormHeader';
import Select from 'react-select';
import { Link, useParams } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

import { v4 as uuidv4 } from 'uuid';
import db from 'lib/firebase';

export default function ProductListForm() {

  const [image, setImage] = useState<any>(null);
  const [categoryList, setCategoryList] = useState<ProductListItem[]>([]);
  const { id } = useParams();

  const ProductListCreateSchema = yup.object().shape({
    title: yup.string().trim().required('Title is required.'),
    descriptions: yup.string().trim().required('Description is required'),
    image: yup.string(),
    category: yup.string(),
    quantity: yup.string().required('Quantity is required').trim(),
    actualPrice: yup.string().trim().required('Price is required.'),
    discountedPrice: yup.string(),
  });

  const {
    register,
    handleSubmit, setValue,
    formState: { errors },
  } = useForm<ProductListItem>({
    resolver: yupResolver(ProductListCreateSchema),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getData = async () => {
    const q = await getDocs(collection(db, 'category'));
    const data = q.docs.map(i => i.data() as ProductListItem);
    setCategoryList(data);

  };

  useEffect(() => {
    getData();
  }, []);


  const onSubmit = async (data: ProductListItem) => {

    const file = image;
    const storage = getStorage();
    const storagePath = 'uploads/' + file.name;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
    });

    //update
    getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
      const taskDocRef = doc(db, 'productForm', String(id));
      if (id) {
        try {
          await updateDoc(taskDocRef, {
            title: data.title,
            descriptions: data.descriptions,
            image: url,
            category: data.category,
            quantity: data.quantity,
            actualPrice: data.actualPrice,
            discountedPrice: data.discountedPrice
          });

        } catch (err) {
          alert(err);
        }
        setImage('');
      } else {

        // Data  insert in firebase
        const generateId = uuidv4();
        await setDoc(doc(db, 'productForm', generateId), {

          id: generateId,
          title: data.title,
          descriptions: data.descriptions,
          image: url,
          category: data.category,
          quantity: data.quantity,
          actualPrice: data.actualPrice,
          discountedPrice: data.discountedPrice

        });
      }
      alert('Successfully submit');
      setImage(null);
    });
  };

  //Edit 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchingData = async () => {
    const docRef = doc(db, 'productForm', String(id));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {

      setValue('title', docSnap.data().title);
      setValue('descriptions', docSnap.data().descriptions);
      setValue('image', docSnap.data().url);
      setValue('category', docSnap.data().category);
      setValue('quantity', docSnap.data().quantity);
      setValue('actualPrice', docSnap.data().actualPrice);
      setValue('discountedPrice', docSnap.data().discountedPrice);
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    fetchingData();
  }, [setValue, fetchingData, id]);

  const handleImageAsFile = (e: any) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <AuthHeader />
      <div className='min-h-full flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-2'>
          <div>
            <h2 className='text-center text-3xl font-extrabold text-gray-900'>Create Product List</h2>
          </div>
          <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='rounded-md -space-y-px'>

              {/* image */}
              <div className='pb-2'>
                <input type="file"  {...register('image')} onChange={handleImageAsFile} /><br />
              </div>
              <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
              {/* image End  */}

              {/* title  */}
              <div className='pb-2'>
                <TextInputField type='text' placeholder='Title' register={register('title')} />
              </div>
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              {/* title End  */}

              {/* description  */}
              <div className='pb-2'>
                <TextInputField type='text' placeholder='Description' register={register('descriptions')} />
              </div>
              <FormErrorMessage>{errors.descriptions?.message}</FormErrorMessage>
              {/* description End */}


              {/* Category  */}
              <div>
                <label className='block font-bold mb-2'>Categories</label>
                <div>
                  <select {...register('category')}>
                    {categoryList && categoryList.map(item => {
                      return (
                        <option key={item.id} value={item.categoryName}>{item.categoryName}
                        </option>
                      );
                    })
                    }
                  </select>
                </div>
              </div>
              {/* Category End  */}
              {/* Quantity */}
              <div className='pt-3 pb-2'>
                <TextInputField type='number' placeholder='Stock quantity' register={register('quantity')} />
              </div>
              <FormErrorMessage>{errors.quantity?.message}</FormErrorMessage>
              {/* Quantity End  */}

              {/* Actual price */}
              <div className='pb-2'>
                <TextInputField type='number' placeholder='Actual Price' register={register('actualPrice')} />
              </div>
              <FormErrorMessage>{errors.actualPrice?.message}</FormErrorMessage>
              {/* Actual price End  */}

              {/* Discounted price */}
              <div>
                <TextInputField type='number' placeholder='Discounted Price' register={register('discountedPrice')} />
              </div>
              {/* Discounted price End  */}
            </div>

            <div className='flex justify-center'>
              <Button>Add</Button>
            </div>
          </form>
        </div>
      </div>

    </>
  );

}

