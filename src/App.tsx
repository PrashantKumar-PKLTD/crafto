import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PianoPDFs from './pages/PianoPDFs';
import LearnPiano from './pages/LearnPiano';
import FreeSongs from './pages/FreeSongs';
import About from './pages/About';
import Contact from './components/Contact';
import Admin from './pages/Admin';
import PaymentVerification from './components/PaymentVerification';

function App() {
  useEffect(() => {
    // Handle payment URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const productId = urlParams.get('product');
    const email = urlParams.get('email');
    
    if (payment && productId && email) {
      // Auto-trigger payment flow
      console.log('Payment flow triggered:', { payment, productId, email });
      // You can add logic here to automatically open the payment modal
      // or redirect to a dedicated payment page
    }
  }, []);

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add padding top to account for fixed header and banner
    document.body.style.paddingTop = '120px';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.paddingTop = '120px';
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/piano-pdfs" element={<PianoPDFs />} />
            <Route path="/learn-piano" element={<LearnPiano />} />
            <Route path="/free-songs" element={<FreeSongs />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;