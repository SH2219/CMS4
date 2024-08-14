import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home'; // Example Component
import AboutUs from './Components/AboutUs'; // Example Component
import StartupDirectory from './Components/StartupDirectory'; // Example Component
import Initiatives from './Components/Initiatives'; // Example Component
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/startup-directory" element={<StartupDirectory />} />
        <Route path="/initiatives" element={<Initiatives />} />
      </Routes>
    </Router>
  );
}

export default App;
