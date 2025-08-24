import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Perfil from './components/Perfil';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
