import React from 'react';
import Navbar from './components/Navbar.jsx'; // adjust the path as needed
import Sidebar from './components/Sidebar.jsx'; // adjust the path as needed
import {  Routes, Route } from 'react-router-dom';
import Order from './pages/Orders/Order.jsx';
import Add from './pages/Add/Add.jsx';
import List from './pages/List/List.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const url ="http://localhost:4000 url={}"

  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/add" element={<Add url={url}/>}/>
          <Route path="/List" element={<List url={url}/>}/>
          <Route path="/Orders" element={<Order url={url}/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
