import React, { useState, useEffect, useRef } from 'react';
import { Play, Download, Users, Award, Clock, Smartphone, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Play,
    title: 'Interactive Video Lessons',
    description: 'High-quality piano video tutorials with step-by-step guidance from professional pianists.',
    color: 'from-blue-500 to-cyan-500',
    delay: '0s'
  },
  {
    icon: Download,
    title: 'Downloadable Resources',
    description: 'Piano sheet music, chord charts, and practice materials you can access offline.',
    color: 'from-green-500 to-emerald-500',
    delay: '0.1s'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Connect with fellow piano students and get feedback from experienced instructors.',
    color: 'from-purple-500 to-pink-500',
    delay: '0.2s'
  },
  {
    icon: Award,
    title: 'Certificates',
    description: 'Earn certificates of completion to showcase your piano achievements.',
    color: 'from-yellow-500 to-orange-500',
    delay: '0.3s'
  },
  {
    icon: Clock,
    title: 'Learn at Your Pace',
    description: 'Flexible scheduling allows you to practice piano whenever it suits you best.',
    color: 'from-indigo-500 to-purple-500',
    delay: '0.4s'
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access your piano lessons on any device, anywhere, anytime.',
    color: 'from-teal-500 to-blue-500',
    delay: '0.5s'
  }
];

const Features = () => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(features.length).fill(false));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-features-pattern animate-pulse"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-purple-500/10 rounded-full animate-float blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 glass rounded-full text-purple-300 font-semibold text-sm mb-4 animate-pulse-glow">
            ⚡ Powerful Features
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              PianoLearn
            </span>?
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            We provide everything you need to master the piano with confidence, joy, and cutting-edge technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                ref={el => itemRefs.current[index] = el}
                data-index={index}
                className={`group relative overflow-hidden rounded-3xl glass hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 ${
                  visibleItems[index] ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: feature.delay }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative p-8 text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg relative overflow-hidden`}>
                      <IconComponent className="w-10 h-10 text-white relative z-10" />
                      
                      {/* Animated Glow */}
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    </div>
                    
                    {/* Floating Particles */}
                    {hoveredIndex === index && (
                      <>
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-70" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute top-4 right-4 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
                      </>
                    )}
                  </div>
                  
                  {/* Text Content */}
                  <h3 className="font-bold text-xl text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-purple-100 leading-relaxed mb-6 group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Action Button */}
                  <button className="inline-flex items-center space-x-2 text-purple-300 font-semibold group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 px-6 py-3 rounded-xl transition-all duration-300 border border-purple-400/30 group-hover:border-transparent hover:shadow-lg">
                    <span>Learn More</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Hover Effect Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">Ready to start your piano journey?</span>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 neon-glow">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;