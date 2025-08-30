import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ShoppingCart, Menu, X } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      
      // Hide banner when scrolling down, show when scrolling up
      if (scrollY > 100) {
        setIsBannerVisible(false);
      } else {
        setIsBannerVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Piano PDFs', path: '/piano-pdfs' },
    { name: 'Learn Piano', path: '/learn-piano' },
    { name: 'Free Songs', path: '/free-songs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* Top Banner - Sticky and Animated */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 animate-gradient text-white text-sm py-3 overflow-hidden transition-all duration-500 ${
        isBannerVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center space-x-8 animate-slide-up">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span>SIGN UP & ENJOY 10% OFF</span>
            </span>
            <span className="hidden md:flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>FREE SHIPPING ON ALL ORDERS ABOVE $50+</span>
            </span>
            <span className="hidden lg:flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span>WELCOME TO PIANOLEARN</span>
            </span>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={() => setIsBannerVisible(false)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300 hover:scale-110"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Main Header with glassmorphism */}
      <header className={`fixed w-full z-40 transition-all duration-500 ${
        isScrolled 
          ? 'glass backdrop-blur-xl shadow-2xl' 
          : 'bg-white/90 backdrop-blur-sm'
      } ${isBannerVisible ? 'top-12' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <Logo className="w-12 h-12" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
               PLAYCRAFTO
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative hover:text-purple-600 transition-all duration-300 font-medium group animate-slide-up ${
                    location.pathname === item.path ? 'text-purple-600' : 'text-gray-700'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300 ${
                    location.pathname === item.path ? 'w-full' : 'w-0'
                  }`}></span>
                </Link>
              ))}
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative group">
                 
                  <div className="absolute -inset-2 bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <div className="relative group">
                 
                  
                  <div className="absolute -inset-2 bg-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="glass-dark px-4 py-6 space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block hover:text-purple-300 transition-colors duration-300 font-medium py-2 animate-slide-up ${
                  location.pathname === item.path ? 'text-purple-300' : 'text-white'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
              </Link>
            ))}
           
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;