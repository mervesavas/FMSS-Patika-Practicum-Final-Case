import './style/style.css';
import Main from './components/main';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Detail from './components/Detail';

function App() {
  return (
    <>
     {/* React Router Routes ve Route bileşenlerini kullanarak, sayfalarımızı yönlendiriyoruz */}
      <Routes>
        <Route path='/' element={<Main/>} />
        <Route path='/:model' element={<Detail></Detail>}/>
      </Routes>
    </>
  );
}

export default App;
