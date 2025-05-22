import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = `${url}/api/user/${currState === "Login" ? "login" : "register"}`;

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {

        if (currState === "Login") {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          setShowLogin(false);
          window.location.reload();
        } else {
          alert("Registration successful! Please login.");
          setCurrState("Login"); 
        }

      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>
        <div className='login-popup-title'>
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
        </div>

        <div className='login-popup-inputs'>
          {currState === "Sign Up" && (
            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type='email' placeholder='Your email' required />
          <input name='password' type="password" onChange={onChangeHandler} value={data.password} placeholder='Password' required />
        </div>

        <button type='submit'>{currState === "Sign Up" ? "Create Account" : "Login"}</button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Login" ? (
          <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
