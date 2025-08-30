import React, { useState } from 'react';
import { Play, Clock, Users, Star, BookOpen, Headphones, Award, CheckCircle } from 'lucide-react';

const courseLevels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const pianoLessons = [
  {
    id: 1,
    title: "Piano Fundamentals for Absolute Beginners",
    instructor: "Sarah Johnson",
    image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400",
    level: "Beginner",
    duration: "8 weeks",
    lessons: 24,
    students: 15420,
    rating: 4.9,
    price: "₹3999",
    originalPrice: "₹7999",
    description: "Start your piano journey with proper technique and foundational skills",
    features: [
      "Proper hand positioning and posture",
      "Basic music theory and notation",
      "Simple songs and exercises",
      "Practice routines and tips"
    ]
  },
  {
    id: 2,
    title: "Jazz Piano Essentials",
    instructor: "Marcus Williams",
    image: "https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400",
    level: "Intermediate",
    duration: "12 weeks",
    lessons: 36,
    students: 8750,
    rating: 4.8,
    price: "₹6399",
    originalPrice: "₹12799",
    description: "Master jazz chords, scales, and improvisation techniques",
    features: [
      "Jazz chord progressions",
      "Improvisation fundamentals",
      "Swing and blues styles",
      "Famous jazz standards"
    ]
  },
  {
    id: 3,
    title: "Classical Piano Masterclass",
    instructor: "Elena Rodriguez",
    image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400",
    level: "Advanced",
    duration: "16 weeks",
    lessons: 48,
    students: 5230,
    rating: 4.9,
    price: "₹7999",
    originalPrice: "₹15999",
    description: "Advanced classical techniques and repertoire",
    features: [
      "Advanced finger techniques",
      "Classical repertoire analysis",
      "Performance preparation",
      "Historical context and style"
    ]
  },
  {
    id: 4,
    title: "Pop Piano Hits",
    instructor: "David Chen",
    image: "https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400",
    level: "Beginner",
    duration: "6 weeks",
    lessons: 18,
    students: 12890,
    rating: 4.7,
    price: "₹3199",
    originalPrice: "₹6399",
    description: "Learn to play popular songs with simplified arrangements",
    features: [
      "Chart-topping hits",
      "Chord chart reading",
      "Lead sheet interpretation",
      "Contemporary playing styles"
    ]
  },
  {
    id: 5,
    title: "Piano Theory Deep Dive",
    instructor: "Dr. Amanda Foster",
    image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400",
    level: "Intermediate",
    duration: "10 weeks",
    lessons: 30,
    students: 6540,
    rating: 4.8,
    price: "₹5599",
    originalPrice: "₹11199",
    description: "Comprehensive music theory for piano players",
    features: [
      "Advanced harmony concepts",
      "Chord analysis and progressions",
      "Scale theory and modes",
      "Composition techniques"
    ]
  },
  {
    id: 6,
    title: "Piano Technique Bootcamp",
    instructor: "Robert Kim",
    image: "https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400",
    level: "All Levels",
    duration: "4 weeks",
    lessons: 12,
    students: 9870,
    rating: 4.6,
    price: "₹2399",
    originalPrice: "₹4799",
    description: "Intensive technique training for all skill levels",
    features: [
      "Finger independence exercises",
      "Speed and accuracy drills",
      "Injury prevention techniques",
      "Practice efficiency methods"
    ]
  }
];

const LearnPiano = () => {
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLessons = pianoLessons.filter(lesson => {
    const matchesLevel = selectedLevel === 'All Levels' || lesson.level === selectedLevel;
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Learn Piano Online
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Master piano with expert-led video courses designed for every skill level
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">50,000+</div>
              <div className="text-purple-200">Active Students</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">200+</div>
              <div className="text-purple-200">Video Lessons</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-purple-200">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Filters */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-6">
              {courseLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedLevel === level
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <div className="max-w-2xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses, instructors, topics..."
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Course Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {lesson.level}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/95 backdrop-blur-sm text-purple-600 p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300">
                      <Play className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {lesson.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">by {lesson.instructor}</p>
                    <p className="text-gray-500 text-sm">{lesson.description}</p>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{lesson.lessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{lesson.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{lesson.rating}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">What you'll learn:</h4>
                    <ul className="space-y-1">
                      {lesson.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-purple-600">
                        {lesson.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {lesson.originalPrice}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Start Learning</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Piano Courses?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from world-class instructors with proven teaching methods
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Headphones,
                title: "Expert Instructors",
                description: "Learn from professional pianists and certified music teachers"
              },
              {
                icon: Play,
                title: "HD Video Lessons",
                description: "Crystal clear video quality with multiple camera angles"
              },
              {
                icon: Award,
                title: "Certificates",
                description: "Earn certificates of completion for your achievements"
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Connect with fellow students and get feedback"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnPiano;