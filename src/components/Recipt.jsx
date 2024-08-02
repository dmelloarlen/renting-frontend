import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/Recipt.css";
import axios from "axios";

export default function Recipt() {
  const [receiptData, setReceiptData] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [products,setProducts] = useState([]);
  const [vehical, setVehical] = useState([]);

  const [error,setError] = useState(null);
  const currentDate = new Date().toLocaleDateString();

  const handlePrintClick = () => {
    var printContents = document.getElementById("a").innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };
  const a=useParams()
  useEffect(() => {
    fetch("http://localhost:4000/getorder")
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            console.log('Fetched data:', data);
            setProducts(data);
        })
        .catch((error) => {
            console.error('Fetch error:', error);
            setError(error);
        });
}, []);

useEffect(() => {
  const getVehicalDetails = async () => {
    console.log(a.vid)
    try {
      const res = await axios.get(`http://localhost:4000/allproducts/${a.vid}`);
      if (res) {
        console.log(res.data);
        setVehical(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  getVehicalDetails();

}, []);

console.log(products)
  return (
    <div className="container d-flex justify-content-center mt-3">
      <div className="receipt">
        <div id="a">
        <div className="header">
          <h2>RENTING RECIPT</h2>
          <p><strong>Date: {currentDate}</strong></p>
        </div>
        <hr className="px-0" />
        {vehical && products.map((item, index) => (
          item._id==a.id?
        <div className="body">
          <table className="table">
            <tbody>
              <tr>
                <th className="th">Vehicle Name</th>
                <td className="td">
                  <strong>{vehical.name}</strong>
                </td>
              </tr>
              <tr>
                <th className="th">Type</th>
                <td className="td">
                    {vehical.category}
                </td>
              </tr>
              <tr>
                <th className="th">Clients Name</th>
                <td className="td">{item.name}</td>
              </tr>
              <tr>
                <th className="th">Booked for:</th>
                <td className="td">
                  <strong>{item.date}</strong>
                </td>
              </tr>
              <tr>
                <th className="th">Rent per Day</th>
                <td className="td">{vehical.new_price}</td>
              </tr>
              <tr>
                <th className="th">Total Days Of Renting</th>
                <td className="td">
                  <strong>{item.days}</strong>
                </td>
              </tr>
              <tr>
                <th className="th">Phone</th>
                <td className="td">{item.phone}</td>
              </tr>
              <tr>
                <th className="th">Email</th>
                <td className="td">{item.email}</td>
              </tr>
              <tr>
                <th className="th">Pickup/Drop Address</th>
                <td className="td">
                  {vehical.zip}
                </td>
              </tr>
            </tbody>
          </table>
        <div className="footer">
          <h3>Total Amount:{parseInt(vehical.new_price)*parseInt(item.days.split(' ')[0])}</h3>
        </div>
        </div>:null
         ))}
       
        </div>
          <div className='d-flex justify-content-between mt-5'>
         
          <button type="button" className="submitButton" onClick={handlePrintClick}>
            Print
          </button>
          </div>
      </div>
    </div>
  );
}
