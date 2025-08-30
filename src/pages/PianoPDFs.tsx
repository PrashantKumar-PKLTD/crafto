import React, { useState } from 'react';
import { Search, Filter, Star, Download, FileText, Clock, Users } from 'lucide-react';
import { useEffect } from 'react';








const pdfCategories = [
  'All PDFs',
  'Piano PDFs'
];

interface PDFProduct {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: string;
  originalPrice: string;
  rating: number;
  pages: number;
  downloads: number;
  category: string;
  description: string;
  level: string;
  duration: string;
}

const PianoPDFs = () => {
  const [pdfLibrary, setPdfLibrary] = useState<PDFProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All PDFs');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
      const result = await response.json();
      
      if (result.success) {
        setPdfLibrary(result.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setPdfLibrary([]);
    }
  };

  const filteredPDFs = pdfLibrary.filter(pdf => {
    const matchesCategory = selectedCategory === 'All PDFs' || pdf.category === selectedCategory;
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedPDFs = [...filteredPDFs].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
      case 'price-high':
        return parseFloat(b.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
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
            Piano PDF Library
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Discover our comprehensive collection of piano learning materials, sheet music, and guides
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search piano PDFs, sheet music, guides..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl glass text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Category Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-6">
              {pdfCategories.map((category) => (
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
                Showing {sortedPDFs.length} of {pdfLibrary.length} PDFs
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
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPDFs.map((pdf) => (
              <div
                key={pdf.id.toString()}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={pdf.image}
                    alt={pdf.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {pdf.level}
                  </div>
                  <div className="absolute top-4 right-4 p-2.5 bg-red-500 rounded-full shadow-lg">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                      {pdf.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{pdf.subtitle}</p>
                    <p className="text-gray-500 text-xs">{pdf.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{pdf.pages} pages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{pdf.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{pdf.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(pdf.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {pdf.rating}
                    </span>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-purple-600">
                        {pdf.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {pdf.originalPrice}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PianoPDFs;