import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import toast from 'react-hot-toast';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
const id=localStorage.getItem('id')
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

  const handleDelete = async (id) => {
    const c=window.confirm("Are you sure want to delete the vehical!!")
    if (c) {
      try {
        const response = await fetch('https://rental-backend-9vjg.onrender.com/removeproduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': 'Bearer',
          },
          body: JSON.stringify({ id }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          setProducts(products.filter((product) => product._id !== id));
          toast.success("Vehical Deleted Sucessfully!!")
        } else {
          throw new Error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError(error);
      }
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  var x=false;

  return (
    <div className='container mt-3'>
      <div className='row'>
        {products.map((item, index) =>
          item.user ==id  ? (
            <div className='col-md-4 mb-3' key={index}>
             {x=true}
              <div
                className='card w-100 card1'
                style={{ cursor: 'pointer',borderRadius:"15px",border:"1px"}}
              >
                <div className='image-container'>
                  <img
                    src={`https://rental-backend-9vjg.onrender.com/images/${item.image}`} // Make sure to include the base URL
                    className='card-img-top'
                    alt={item.name}
                    style={{ borderRadius: '15px 15px 0px 0px' }}
                  />
                </div>
                <div className='card-body'style={{backgroundColor:"#FBE9D0",borderRadius:"0px 0px 15px 15px"}}>
                  <h5 className='card-title mb-2'>
                    <strong>{item.name}</strong>
                  </h5>
                  <p className='card-text mb-2'>
                    <strong>Rent:</strong> {item.new_price}
                  </p>
                  <p className='card-text'>
                    <strong>Type:</strong> {item.description}
                  </p>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                  <button
                    className='btn btn-primary ms-2'
                    onClick={() => navigate('/update/' + item._id)}
                    >Update</button>
                </div>
              </div>
            </div>
          ) : null
        )
      }
      {x?null:<h3 className='d-flex justify-content-center'>YOU HAVE NOT ADDED ANY VEHICAL YET!!</h3>}
      </div>
    </div>
  );
}