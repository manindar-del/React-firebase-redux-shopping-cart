/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-shadow

import { addDoc, collection } from '@firebase/firestore';
import { Products } from 'Interface/productinterface';
import React, { useEffect, useState } from 'react';
import db from '../../../lib/firebase';
import { deleteDoc, doc, getDocs, limit, query, startAfter } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import  Pagination from '../../Pagination/Pagination';



export default function PostList() {

  const { id } = useParams();
  const [list, setList] = useState<Products[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  





  const lastItem =  page * totalPages;
  const firstItem =  lastItem - totalPages;



  const handlePrevPage = (prevPage: number) => {
    console.log(prevPage);
    setPage((prevPage) => prevPage - 1);
  };


  const handleNextPage = (nextPage: number) => {
    console.log(nextPage);
    setPage((nextPage) => nextPage + 1);
  };



  // Listing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    console.log('effect');
    const q = await getDocs(collection(db, 'productForm'));
    const data = q.docs.map(i => i.data() as Products);
    
    setList(data);

    
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete 
  const handleDelete = async (id: number) => {
    const taskDocRef = doc(db, 'productForm', String(id));
    try {
      await deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
    window.location.reload();
  };

  
  return (
    <div> 
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
                <a className="nav-link active text-white" aria-current="page"><Link to='/product/'>Return Product Add Form</Link></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <br/><br/>
     
      <h3 className='text-center'>Products Lists</h3><br/><br/>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      #
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Title
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Descriptions
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Price
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Category
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Related Products
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Image
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>

                  {list && list.slice(firstItem, lastItem).map(item => {
                    return (
                      <tr className="border-b">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                        <><td key={item.id} className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.title}
                        </td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.descriptions}
                          </td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.price}
                          </td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.category}
                            </td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.related_products}
                          </td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            <img src={item.images}></img>
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            <Link to={`/product/${item.id}`}><button className=' bg-blue-600 text-white'>Edit</button></Link>
                            <br />
                            <br />
                            <button className='bg-red-600 text-white' onClick={() => handleDelete(item.id)}>Delete</button>
                          </td>
                        </>
                      </tr>
                    );
                  })
                  }
                </tbody>
              </table>
              <Pagination
            totalPages={totalPages}
            currentPage={page}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
          />
            </div>
          </div>
        </div>
      </div>
     
    </div>

  
  );
}

