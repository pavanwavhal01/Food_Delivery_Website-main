import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    discount,
    setDiscount,
  } = useContext(StoreContext);

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const navigate = useNavigate();

  const handlePromoSubmit = async () => {
    if (promoCode.trim() === '') {
      setPromoError('Please enter a promo code');
      setPromoSuccess('');
      return;
    }

    try {
      const response = await axios.post(`${url}/api/promo/validate`, { promoCode });

      if (response.data.success) {
        setDiscount(response.data.discount); // Promo code valid, apply discount
        setPromoError('');
        setPromoSuccess('Promo code applied successfully!');
      } else {
        setPromoError('Invalid promo code');
        setPromoSuccess('');
        setDiscount(0); // Reset discount if promo code is invalid
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      setPromoError('Server error. Try again later.');
      setPromoSuccess('');
    }
  };

  // Calculate final total including discount
  const finalTotal = getTotalCartAmount() + 20 - discount;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + '/images/' + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
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
            <hr />

            {discount > 0 && (
              <div className="cart-total-details">
                <p>Discount</p>
                <p>-₹{discount}</p>
              </div>
            )}
            <hr />

            <div className="cart-promocode">
              <div>
                <p>If you have a promo code, Enter it here</p>
                <div className="cart-promocode-input">
                  <input
                    type="text"
                    placeholder="promo-code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={handlePromoSubmit}>Submit</button>
                </div>
                {promoError && <p className="promo-error">{promoError}</p>}
                {promoSuccess && <p className="promo-success">{promoSuccess}</p>}
              </div>
            </div>

            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{finalTotal}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
