import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';  // Update this path
import InvoiceForm from './components/InvoiceForm';    // Update this path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/invoice" element={<InvoiceForm />} />
      </Routes>
    </Router>
  );
}

export default App;
