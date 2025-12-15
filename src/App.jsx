import './App.css'
import { DatePicker } from 'antd';
import { Divider,Input } from 'antd';
// import { useState } from 'react';
import Loading from './components/Loading';
import ListForecast from './components/ListForecast';
// import DownloadForecast from './components/ChartComponent';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {



  return (
    <>

     <Router>
      <div>
        {/* Навигационное меню */}
        <nav className='nav' >
          <Link to="/" style={{ marginRight: '10px' }}>Прогнозирование</Link>
          <Link to="/forecasts" style={{ marginRight: '10px' }}>Мои прогнозы</Link>
          {/* <Link to="/forecasts" style={{ marginRight: '10px' }}>Прогнозы</Link> */}
          {/* <Link to="/login">Вход</Link> */}
        </nav>

        {/* Роуты */}
        <Routes>
          <Route path="/" element={<Loading userId={(45)}/>} />
          <Route path="/forecasts" element={<ListForecast userId={(45)} />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>


    </>
  )
}

export default App
