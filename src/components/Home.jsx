import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [vehical,setVehical]=useState()

  useEffect(() => {
    fetch('https://rental-backend-9vjg.onrender.com/allproducts', {
      headers: {
        'auth-token': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error('Data is not an array');
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error);
      });
  }, []);

  useEffect(() => {
    const fetchProductsAndOrders = async () => {
      try {
        const res = await axios.get("https://rental-backend-9vjg.onrender.com/getorder");
        if (res) {
          console.log(res.data);
          setVehical(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProductsAndOrders();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='container mt-3'>
      <h1 className='text-center'>Welcome to Renting</h1>
      <div className='row'>
        {vehical && products.map((item, index) =>
         (
            <div className='col-md-4 mb-3' key={index}>
              <div
                className='card w-100 card1'
                onClick={(e) => {
                  const hasMatchingCourse = vehical.some(element => element.course === item._id);
                  if (hasMatchingCourse) {
                      toast.error("This vehical is already rented!!!")
                  } else {
                      navigate('/rentnow/' + item._id);
                  }
              }}
                style={{ cursor: 'pointer', borderRadius: '15px', border: '3px' }}
              >
                <div className='image-container'>
                  <img
                    src={`https://rental-backend-9vjg.onrender.com/images/${item.image}`} // Make sure to include the base URL
                    className='card-img-top'
                    alt={item.name}
                    style={{ borderRadius: '15px 15px 0px 0px' }}
                  />
                </div>
                <div className='card-body' style={{backgroundColor:"rgb(251, 233, 208)",borderRadius:"10px"}}>
                  <h5 className='card-title d-flex justify-content-between mb-2'>
                    <strong>{item.name}</strong>
                    {vehical.map((element)=>element.course==item._id?(<strong style={{color:"red"}}>Booked</strong>):null)}
                  </h5>
                  <p className='card-text mb-2'>
                    <strong>Rent:</strong> {item.new_price}
                  </p>
                  <p className='card-text'>
                    <strong>Type:</strong> {item.category}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
