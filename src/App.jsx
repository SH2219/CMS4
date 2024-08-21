import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Demo from "./Components/Demo";
import Header from "./Components/Header";
import "./App.css";
import { LanguageProvider } from "./LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page/:pageId" element={<Demo />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
