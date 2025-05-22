import React from 'react'
import './Sidebar.css'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'


const sidebar = () => {
  return (
    <div className='sidebar'>
        <div className='sidebar-options'>
        
            <NavLink to="/add" className='sidebar-option'>
                <img src={assets.add_icon_white} alt="" />
                <p>Add Items</p>
            </NavLink><br />

            <NavLink to ='/list' className='sidebar-option'>
                <img src={assets.basket_icon} alt="" />
                <p>List Items</p>
            </NavLink><br />
            <NavLink to='/orders' className='sidebar-option'>
                <img src={assets.basket_icon} alt="" />
                <p>Order Items</p>
            </NavLink>

            </div>
        
      
    </div>
  )
}

export default sidebar;
