import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SuccessPage from './pages/SuccessPage';
import CheckoutPage from './pages/CheckoutPage';
import PackagesPage from './pages/PackagesPage';
import Hotjar from '@hotjar/browser';

function App() {
  const siteId = 3871917;
  const hotjarVersion = 6;

  Hotjar.init(siteId, hotjarVersion);

  return (
    <Router>
      <Routes>
        <Route path="/payment/packages" element={<PackagesPage />} />
        <Route path="/payment/checkout" element={<CheckoutPage />} />
        <Route path="/payment/checkout/succeed" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
