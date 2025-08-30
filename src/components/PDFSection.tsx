import React, { useState, useEffect } from 'react';
import { FileText, Download, Star, Eye, ShoppingCart } from 'lucide-react';
import PDFPreview from './PDFPreview';

interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  pages: number;
  downloads: number;
  image: string;
  preview: string;
}

const PDFSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const result = await response.json();
      
      if (result.success) {
        // Map the products to include default values and proper image URLs
        const mappedProducts = result.products.map((product: any) => ({
          ...product,
          image: product.image || 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
          pdfUrl: product.preview || '#'
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Set some demo products if API fails
      setProducts([
        {
          id: 'demo-1',
          title: 'Piano Basics for Beginners',
          subtitle: 'Complete starter guide',
          description: 'Learn piano fundamentals with our comprehensive beginner guide',
          price: 99,
          originalPrice: 199,
          rating: 4.8,
          pages: 45,
          downloads: 1250,
          image: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
          preview: '#'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (product: Product) => {
    setSelectedProduct(product);
  };

  const closePreview = () => {
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <section id="pdf-preview" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading piano PDFs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="pdf-preview" className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full text-purple-600 font-semibold text-sm mb-4">
              📚 Featured PDFs
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Piano Learning{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                PDFs
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Download comprehensive piano learning materials and sheet music to accelerate your musical journey
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* PDF Badge */}
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      PDF
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ₹{product.price}
                    </div>
                    
                    {/* Preview Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handlePreview(product)}
                        className="bg-white/95 backdrop-blur-sm text-purple-600 p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center gap-2"
                      >
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{product.subtitle}</p>
                      <p className="text-gray-500 text-xs">{product.description}</p>
                    </div>

                    {/* Product Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{product.pages} pages</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{product.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-purple-600">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handlePreview(product)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Preview & Buy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No PDFs Available</h3>
              <p className="text-gray-600">Check back soon for new piano learning materials!</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-purple-600" />
                <span className="text-gray-900 font-semibold">Want to see all our piano PDFs?</span>
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                Browse All PDFs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Preview Modal */}
      {selectedProduct && (
        <PDFPreview 
          product={selectedProduct} 
          onClose={closePreview} 
        />
      )}
    </>
  );
};

export default PDFSection;