import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [vehical, setVehical] = useState([]);
  const userId = localStorage.getItem("id");

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
  }, [userId]);

  return (
    <div className="container mt-3">
      <h3 className="text-center">Your Rented Products</h3>
      <div className="row">
        {vehical &&
          vehical.map((item, index) =>
            localStorage.getItem("id") == item.user ? (
              <div className="col-md-4 mb-3" key={index}>
                <div
                  className="card w-100 card1"
                  onClick={() =>
                    navigate("/recipt/" + item._id + "/" + item.course)
                  }
                  style={{
                    cursor: "pointer",
                    borderRadius: "15px",
                    border: "1px",
                  }}
                >
                  <div class="image-container">
                    <img
                      src={`https://rental-backend-9vjg.onrender.com/images/${item.image}`}
                      className="card-img-top"
                      alt="..."
                      style={{ borderRadius: "15px 15px 0px 0px" }}
                    />
                  </div>
                  <div className="card-body" style={{backgroundColor:"#FBE9D0",borderRadius:"0px 0px 15px 15px"}}>
                    <h5 className="card-title mb-2">
                      <strong>{item.vname}</strong>
                    </h5>
                    <p className="card-text mb-2">
                      <strong>Rented for:</strong>
                      {item.date}
                    </p>
                  </div>
                </div>
              </div>
            ) : null
          )}
      </div>
    </div>
  );
}
