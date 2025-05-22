import React, { useEffect, useState } from 'react'
import './Order.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const url = "http://localhost:4000";

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order-add'>
      <h3>Order Page</h3>
      <p>Total Orders: {orders.length}</p> {/* Displaying total orders count */}
      <div className="order-list">
        {orders.map((order, index) => {
          return (
            <div key={index}>
              <div>
                <div className="order-item">
                  <img src={assets.parcel_icon} alt="" />
                  <p className='order-item-food'>
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return item.name + " X " + item.quantity;
                      } else {
                        return item.name + " X " + item.quantity + ", ";
                      }
                    })}
                  </p>
                  <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p><br />
                  <div className="order-item-address">
                    <p>{order.address.street + ","}</p>
                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode + ", "}</p>
                    <p className="order-item-phone">{order.address.phone}</p>
                  </div>
                  <p>Items :{order.items.length}</p>
                  <p>₹{order.amount}</p>

                  {/* Display Payment Status */}
                  <p><b>Payment Status: </b>{order.payment ? "Paid" : "Pending"}</p>

                  <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Order;
