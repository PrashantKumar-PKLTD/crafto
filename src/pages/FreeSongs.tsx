import React, { useState } from 'react';
import { Download, Play, Star, Clock, Music, Search, Filter } from 'lucide-react';

const songCategories = [
  'All Songs',
  'Pop Hits',
  'Classical',
  'Jazz Standards',
  'Christmas Songs',
  'Movie Themes',
  'Folk Songs',
  'Children\'s Songs'
];

const freeSongs = [
  {
    id: 1,
    title: "Happy Birthday",
    artist: "Traditional",
    category: "Children's Songs",
    difficulty: "Beginner",
    duration: "1:30",
    downloads: 45230,
    rating: 4.8,
    description: "The classic birthday song everyone should know how to play",
    image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400",
    features: ["Simple melody", "Basic chords", "Easy to memorize"]
  },
  {
    id: 2,
    title: "Für Elise",
    artist: "Ludwig van Beethoven",
    category: "Classical",
    difficulty: "Intermediate",
    duration: "3:25",
    downloads: 38920,
    rating: 4.9,
    description: "Beethoven's beloved piano piece in a simplified arrangement",
    image: "https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400",
    features: ["Classical technique", "Finger independence", "Dynamic expression"]
  },
  {
    id: 3,
    title: "Imagine",
    artist: "John Lennon",
    category: "Pop Hits",
    difficulty: "Beginner",
    duration: "3:07",
    downloads: 52100,
    rating: 4.7,
    description: "John Lennon's timeless classic with simple chord progressions",
    image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400",
    features: ["Basic chords", "Emotional expression", "Sing-along friendly"]
  },
  {
    id: 4,
    title: "Autumn Leaves",
    artist: "Joseph Kosma",
    category: "Jazz Standards",
    difficulty: "Intermediate",
    duration: "4:15",
    downloads: 29870,
    rating: 4.8,
    description: "Essential jazz standard with beautiful chord progressions",
    image: "https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400",
    features: ["Jazz chords", "Swing rhythm", "Improvisation basics"]
  },
  {
    id: 5,
    title: "Silent Night",
    artist: "Franz Gruber",
    category: "Christmas Songs",
    difficulty: "Beginner",
    duration: "2:45",
    downloads: 67890,
    rating: 4.9,
    description: "The beloved Christmas carol in an easy piano arrangement",
    image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400",
    features: ["Gentle melody", "Simple harmony", "Perfect for holidays"]
  },
  {
    id: 6,
    title: "The Entertainer",
    artist: "Scott Joplin",
    category: "Classical",
    difficulty: "Advanced",
    duration: "4:30",
    downloads: 23450,
    rating: 4.6,
    description: "Classic ragtime piece that's fun and challenging to play",
    image: "https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400",
    features: ["Ragtime style", "Syncopated rhythm", "Hand coordination"]
  },
  {
    id: 7,
    title: "My Heart Will Go On",
    artist: "Celine Dion",
    category: "Movie Themes",
    difficulty: "Intermediate",
    duration: "4:40",
    downloads: 41230,
    rating: 4.7,
    description: "The iconic theme from Titanic arranged for solo piano",
    image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400",
    features: ["Emotional melody", "Arpeggiated accompaniment", "Dynamic range"]
  },
  {
    id: 8,
    title: "Twinkle, Twinkle, Little Star",
    artist: "Traditional",
    category: "Children's Songs",
    difficulty: "Beginner",
    duration: "1:15",
    downloads: 78920,
    rating: 4.5,
    description: "Perfect first song for beginning piano students",
    image: "https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg?auto=compress&cs=tinysrgb&w=400",
    features: ["Five-finger position", "Simple rhythm", "Great for kids"]
  },
  {
    id: 9,
    title: "Scarborough Fair",
    artist: "Traditional English",
    category: "Folk Songs",
    difficulty: "Intermediate",
    duration: "3:20",
    downloads: 19870,
    rating: 4.8,
    description: "Beautiful English ballad with haunting melody",
    image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400",
    features: ["Modal harmony", "Expressive phrasing", "Celtic style"]
  }
];

const FreeSongs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Songs');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredSongs = freeSongs.filter(song => {
    const matchesCategory = selectedCategory === 'All Songs' || song.category === selectedCategory;
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedSongs = [...filteredSongs].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'difficulty':
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Free Piano Songs
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Download free piano sheet music for songs across all genres and skill levels
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search free songs, artists, genres..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl glass text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-purple-200">Free Songs</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-purple-200">Downloads</div>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-purple-200">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Category Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-6">
              {songCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {sortedSongs.length} of {freeSongs.length} free songs
              </p>
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="title">Alphabetical</option>
                  <option value="difficulty">By Difficulty</option>
                </select>
              </div>
            </div>
          </div>

          {/* Songs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedSongs.map((song) => (
              <div
                key={song.id}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Song Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Difficulty Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                    song.difficulty === 'Beginner' ? 'bg-green-500' :
                    song.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {song.difficulty}
                  </div>

                  {/* Free Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    FREE
                  </div>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/95 backdrop-blur-sm text-purple-600 p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer">
                      <Play className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Song Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                      {song.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">by {song.artist}</p>
                    <p className="text-gray-500 text-xs">{song.description}</p>
                  </div>

                  {/* Song Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{song.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{song.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{song.rating}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {song.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Download Button */}
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Free Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Free Songs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Free Songs?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              High-quality arrangements that make learning piano enjoyable and accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Music,
                title: "Professional Quality",
                description: "All arrangements created by professional musicians and educators"
              },
              {
                icon: Download,
                title: "Instant Download",
                description: "Get your sheet music immediately after clicking download"
              },
              {
                icon: Star,
                title: "Rated & Reviewed",
                description: "Community ratings help you find the best arrangements"
              },
              {
                icon: Clock,
                title: "Always Free",
                description: "No hidden costs, no subscriptions - completely free forever"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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

export default FreeSongs;