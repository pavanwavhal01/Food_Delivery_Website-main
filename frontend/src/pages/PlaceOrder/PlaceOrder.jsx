import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, discount } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    pincode: "",
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    country: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "pincode") {
      if (value.length !== 6) {
        setErrors((prevErrors) => ({ ...prevErrors, pincode: "Pincode must be exactly 6 digits." }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, pincode: "" }));
      }
    }

    if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, phone: "Only numbers are allowed." }));
      } else if (value.length > 10) {
        setErrors((prevErrors) => ({ ...prevErrors, phone: "Phone number cannot be more than 10 digits." }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
      }
    }

    setData((data) => ({ ...data, [name]: value }));
  }

  const placeOrder = async (event) => {
    event.preventDefault();

    let hasError = false;
    const newErrors = {};

    // Required field check
    for (const [key, value] of Object.entries(data)) {
      if (!value.trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
        hasError = true;
      }
    }

    // Email format check
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address.";
      hasError = true;
    }

    // Phone check
    if (!/^\d{10}$/.test(data.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      hasError = true;
    }

    // Pincode check
    if (!/^\d{6}$/.test(data.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
      hasError = true;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (hasError) return;

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let finalAmount = getTotalCartAmount() + 20 - discount;

    let orderData = {
      address: data,
      items: orderItems,
      amount: finalAmount,
      promoCode: discount > 0 ? "Promo50" : null,
    };

    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error");
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, []);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        {errors.email && <span className="error">{errors.email}</span>}
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        {errors.street && <span className="error">{errors.street}</span>}
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          {errors.city && <span className="error">{errors.city}</span>}
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
          {errors.state && <span className="error">{errors.state}</span>}
        </div>
        <div className="multi-fields">
          <input required name='pincode' onChange={onChangeHandler} value={data.pincode} type="text" placeholder='Pin code' />
          {errors.pincode && <span className="error">{errors.pincode}</span>}
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
          {errors.country && <span className="error">{errors.country}</span>}
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div className='place-order-right'>
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 20}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p>Discount</p>
                  <p>-₹{discount}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20 - discount}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder;
