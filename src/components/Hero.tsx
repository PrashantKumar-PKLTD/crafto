import React, { useState, useEffect } from 'react';
import { Search, Play, Star, TrendingUp } from 'lucide-react';

const Hero = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Star, value: '50K+', label: 'Happy Students' },
    { icon: Play, value: '1000+', label: 'Video Lessons' },
    { icon: TrendingUp, value: '98%', label: 'Success Rate' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-hero-pattern animate-pulse"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-pink-500/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Content */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 glass rounded-full text-purple-200 font-semibold text-sm mb-4 animate-pulse-glow">
              🎹 #1 Piano Learning Platform
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Play Music
            <br />
            the Effortless Way.
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Learn real songs with A-B-C letters—even if you've never touched an instrument before.
          </p>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className={`relative max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative group">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search piano lessons, techniques, sheet music..."
              className="w-full px-8 py-6 text-lg rounded-2xl glass text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 pr-20"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 neon-glow">
              <Search className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search Suggestions */}
          <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl p-4 opacity-0 group-focus-within:opacity-100 transition-all duration-300">
            <div className="flex flex-wrap gap-2">
              {['Beginner Piano', 'Classical Music', 'Jazz Chords', 'Sheet Music'].map((suggestion) => (
                <span
                  key={suggestion}
                  className="px-4 py-2 bg-purple-600/30 text-purple-200 rounded-lg text-sm cursor-pointer hover:bg-purple-600/50 transition-colors duration-200"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>Download Starter Pack</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button 
            onClick={() => {
              const pdfSection = document.getElementById('pdf-preview');
              if (pdfSection) {
                pdfSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-4 glass text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-400/30"
          >
            Preview the PDF
          </button>
        </div>
        
        {/* Stats */}
       
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;