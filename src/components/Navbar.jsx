import React from 'react';
import { Button, Card } from 'antd';
import { Link } from 'react-router-dom';

const Navbar = () => {

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/auth';
  };

  return (
    <>
     
    <nav className='nav' >
        <Link to="/" style={{ marginRight: '10px' }}>Прогнозирование</Link>
        <Link to="/forecasts" style={{ marginRight: '10px' }}>Мои прогнозы</Link>
        <Link to="/auth" onClick={handleLogout} >Выход</Link>
    </nav>
    
         
    </>
  );
};

export default Navbar;