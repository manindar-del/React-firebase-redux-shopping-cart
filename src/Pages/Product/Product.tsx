/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useParams } from 'react-router-dom';
import { SetStateAction, useEffect, useState } from 'react';
import db from '../../lib/firebase';
import 'firebase/compat/database';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Products } from 'Interface/productinterface';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, list } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';



export default function Product() {

  const [title, setTitle] = useState('');
  const [descriptions, setDescriptions] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<any>(null);


  const { id } = useParams();

  const schema = yup.object().shape({
    title: yup.string(),
    descriptions: yup.string(),
    price: yup.number(),
    category: yup.string(),
    related_products: yup.string(),
  }).required();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Products>({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: Products) => {

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
            price: data.price,
            category: data.category,
            related_products: data.related_products,
            images: url,

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
          price: data.price,
          category: data.category,
          related_products: data.related_products,
          images: url,

        });

      }
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
      setValue('price', docSnap.data().price);
      setValue('category', docSnap.data().category);
      setValue('related_products', docSnap.data().related_products);
      setValue('images', docSnap.data().url);


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
      <nav className="
relative
w-full
flex flex-wrap
items-center
justify-between
py-4
bg-gray-100
text-gray-500
hover:text-gray-700
focus:text-gray-700
shadow-lg
navbar navbar-expand-lg navbar-light
">
        <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
          <button className="
    navbar-toggler
    text-gray-500
    border-0
    hover:shadow-none hover:no-underline
    py-2
    px-2.5
    bg-transparent
    focus:outline-none focus:ring-0 focus:shadow-none focus:no-underline
  " type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars"
              className="w-6" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="currentColor"
                d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z">
              </path>
            </svg>
          </button>
          <div className="collapse navbar-collapse flex-grow items-center" id="navbarSupportedContent">
            <ul className="navbar-nav flex flex-col pl-0 list-style-none mr-auto">
              <li className="nav-item px-2">
                <a className="nav-link active text-white" aria-current="page"><Link to="/listScreen">Products Lists</Link></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <br />
      <br />
      <form onSubmit={handleSubmit(onSubmit)} className='container'>
        <div className='form-input'>
          <input {...register('title')} className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInput123"
            placeholder=' Product Title' />
          <p>{errors.title?.message}</p>

          <textarea {...register('descriptions')} className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInput124"
            placeholder='Descriptions' />
          <p>{errors.descriptions?.message}</p>

          <input {...register('price')} className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInput125" placeholder='Price' />
          <p>{errors.price?.message}</p>

          <input {...register('category')} className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInput125" placeholder='Category' />
          <p>{errors.category?.message}</p>

          <input {...register('related_products')} className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInput125" placeholder='Related Products' />
          <p>{errors.related_products?.message}</p>


        </div>
        <label>Upload Product Image</label><br /><br />
        <input type="file"  {...register('images')} onChange={handleImageAsFile} /><br />
        <br />
        <div className='form-input'>
          <input type="submit" className="
      w-full
      px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"/>
        </div>
      </form>
    </>
  );
}


