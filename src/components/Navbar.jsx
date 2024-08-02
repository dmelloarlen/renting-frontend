import React, { useState } from "react";
import "../css/Navbar.css";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const [logdin, setLogdin] = useState(localStorage.getItem("state")=="true"?true:false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    if (localStorage.getItem("state") == "true") {
      localStorage.removeItem("id");
      localStorage.setItem("state", false);
      setLogdin(false);
      setShowPopup(false);
      toast.success("Logout Sucessfull!!");
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    // console.log(data);
    const userInfo = {
      email: data.email,
      password: data.password,
    };
    try {
      const res = await axios.post("https://rental-backend-9vjg.onrender.com/login", {
        email: userInfo.email,
        password: userInfo.password,
      });
      console.log(res.data)
      if (res.data.success) {
        localStorage.setItem("state", true);
        localStorage.setItem("id", res.data.user._id);
        localStorage.setItem("popup", false);
        setShowPopup(false);
        setLogdin(true);
        toast.success("Login Sucessfull!!");
      }else{
        toast.error("User not found!!");
      }
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg px-3 nva"
        style={{ content: "",backgroundColor:"#FBE9D0"}}
      >
        <a className="navbar-brand" href="/" style={{color:"#244855"}}>
          Rents
        </a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            {/* <li className="nav-item active">
              <Link to={"/carrent"} className="nav-link">
                Vehicals
              </Link>
            </li> */}
           {logdin &&
           <>
            <li className="nav-item" style={{color:"red"}}>
              <Link to={"/myrents"} className="nav-link">
                My Rents
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/addvehical"} className="nav-link">
                Add Vehicle
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/delvehical"} className="nav-link">
                My Vehicals
              </Link>
            </li>
           </>
            }
          </ul>
        </div>
        <button
          className="btn my-2 my-sm-0 ml-auto"
          type="button"
          onClick={togglePopup}
        >
          <strong style={{color:"blue",textDecoration:"underline"}}>{logdin ? "Logout" : "Login"}</strong>
        </button>
      </nav>
      {showPopup && (
        <div className="popup">
          <div className="popup-content"  style={{backgroundColor:""}}>
            <span className="close" onClick={togglePopup}>
              &times;
            </span>
            <h2 style={{fontFamily:"serif"}}>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="d-flex justify-content-start">
                  Username:
                </label>
                <input
                  type="text"
                  className="d-flex justify-content-start"
                  placeholder="Username"
                  id="username"
                  {...register("email", { required: true })}
                  required
                />
              </div>
              <div className="form-group mb-0">
                <label className="d-flex justify-content-start">
                  Password:
                </label>
                <input
                  type="password"
                  className="d-flex justify-content-start"
                  placeholder="Password"
                  id="password"
                  {...register("password", { required: true })}
                  required
                />
              </div>
              <div className="d-flex justify-content-start">
                New to Rentz?
                <Link to={"/signup"} onClick={togglePopup}>
                  Signup
                </Link>
              </div>
              <button type="submit" className="btn-submit w-100 mt-3">
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
