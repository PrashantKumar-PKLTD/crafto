import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-footer-pattern animate-pulse"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full animate-float blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full animate-float blur-2xl" style={{ animationDelay: '3s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <Logo className="w-12 h-12 text-purple-400" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                PLAYCRAFTO
              </span>
            </div>
            <p className="text-purple-100 mb-6 leading-relaxed">
              Empowering piano students of all levels with comprehensive, easy-to-follow lessons and cutting-edge learning technology.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, color: 'hover:text-blue-400' },
                { icon: Twitter, color: 'hover:text-sky-400' },
                { icon: Instagram, color: 'hover:text-pink-400' },
                { icon: Youtube, color: 'hover:text-red-400' }
              ].map(({ icon: Icon, color }, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <Icon className={`w-6 h-6 text-purple-300 ${color} cursor-pointer transition-all duration-300 hover:scale-125`} />
                  <div className="absolute -inset-2 bg-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                'Piano Courses',
                'Piano Lessons', 
                'Sheet Music',
                'Piano Theory',
                'Practice Tools'
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-purple-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block group"
                  >
                    <span className="relative">
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                'Help Center',
                'Contact Us',
                'FAQ',
                'Privacy Policy',
                'Terms of Service'
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-purple-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block group"
                  >
                    <span className="relative">
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Contact Info
            </h3>
            <div className="space-y-4">
              {[
                { icon: Mail, text: 'support@pianolearn.com', color: 'text-purple-400' },
                { icon: Phone, text: '+1 (555) 123-4567', color: 'text-blue-400' },
                { icon: MapPin, text: '123 Music St, Harmony City', color: 'text-pink-400' }
              ].map(({ icon: Icon, text, color }, index) => (
                <div key={index} className="flex items-center space-x-3 group hover:translate-x-2 transition-transform duration-300">
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform duration-300`} />
                    <div className="absolute -inset-2 bg-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  </div>
                  <span className="text-purple-200 group-hover:text-white transition-colors duration-300">
                    {text}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-semibold text-white mb-3">Stay Updated</h4>
              <form className="flex" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const email = formData.get('email');
                if (email) {
                  fetch(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                  }).then(response => response.json())
                    .then(result => {
                      if (result.success) {
                        alert('Successfully subscribed to newsletter!');
                      }
                    })
                    .catch(error => console.error('Newsletter error:', error));
                }
              }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-purple-400/30 rounded-l-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                  required
                />
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 rounded-r-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-purple-800/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-purple-200 flex items-center space-x-2">
              <span>© 2024 PianoLearn. All rights reserved. Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>for piano enthusiasts everywhere.</span>
            </p>
            
            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 neon-glow"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;