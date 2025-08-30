import React, { useState, useEffect, useRef } from 'react';
import { Book, Play, FileText, Headphones, Layout, BookOpen } from 'lucide-react';

const categories = [
  {
    icon: Book,
    title: 'Books',
    description: 'Piano method books and theory guides',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-100',
    count: '150+'
  },
  {
    icon: Play,
    title: 'Courses',
    description: 'Step-by-step piano video lessons',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-100',
    count: '80+'
  },
  {
    icon: FileText,
    title: 'Sheet Music',
    description: 'Piano scores and sheet music',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-100',
    count: '500+'
  },
  {
    icon: Headphones,
    title: 'Audio Lessons',
    description: 'Piano technique audio guides',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-100',
    count: '200+'
  },
  {
    icon: Layout,
    title: 'Practice Tools',
    description: 'Piano metronomes and practice aids',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-100',
    count: '50+'
  },
  {
    icon: BookOpen,
    title: 'Guides',
    description: 'Piano tips and tutorials',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-100',
    count: '120+'
  }
];

const Categories = () => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(categories.length).fill(false));
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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-categories-pattern animate-pulse-glow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full text-purple-600 font-semibold text-sm mb-4 animate-pulse-glow">
            🎯 Explore Categories
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Browse By{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our expertly curated sections designed for seamless navigation and accelerated learning
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                ref={el => itemRefs.current[index] = el}
                data-index={index}
                className={`group cursor-pointer relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 ${
                  visibleItems[index] ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative p-8 text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Count Badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse-glow">
                      {category.count}
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {category.description}
                  </p>
                  
                  {/* Action Button */}
                  <button className="inline-flex items-center space-x-2 text-purple-600 font-semibold group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 px-6 py-3 rounded-xl transition-all duration-300 border border-purple-200 group-hover:border-transparent">
                    <span>Explore</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;