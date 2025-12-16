import './App.css'
import { DatePicker } from 'antd';
import { Divider,Input } from 'antd';
// import { useState } from 'react';
import Loading from './components/Loading';
import ListForecast from './components/ListForecast';
import Authentication  from './components/Authentication';
import Dashboard from './components/Dashboard';
// import DownloadForecast from './components/ChartComponent';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Register from './components/Register.jsx';
import Confirm from  './components/Confirm.jsx';



function App() {
  const isLoggedIn = !!localStorage.getItem('user');

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        <Route path="/register" element={<Register />} />
         <Route path="/confirm" element={<Confirm />} />

        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={isLoggedIn ? <Loading /> : <Navigate to="/auth" />} />
              <Route path="/forecasts" element={isLoggedIn ? <ListForecast /> : <Navigate to="/auth" />} />
            </Routes>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App
