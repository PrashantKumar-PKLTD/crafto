import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  LogOut,
  BarChart3,
  Download,
  Mail,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  original_price: number;
  pages: number;
  downloads: number;
  rating: number;
  status: string;
  created_at: string;
}

interface DashboardStats {
  totalProducts: number;
  totalPurchases: number;
  totalRevenue: number;
  totalSubscribers: number;
  totalMessages: number;
  recentPurchases: any[];
  recentMessages: any[];
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: '',
    originalPrice: '',
    pages: '',
    pdf: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      
      if (result.success) {
        setToken(result.token);
        localStorage.setItem('adminToken', result.token);
        setIsLoggedIn(true);
        fetchDashboardData();
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setDashboardStats(result.stats);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setProducts(result.products);
      }
    } catch (error) {
      console.error('Products fetch error:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData.pdf) {
      alert('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('pdf', uploadData.pdf);
      formData.append('title', uploadData.title);
      formData.append('subtitle', uploadData.subtitle);
      formData.append('description', uploadData.description);
      formData.append('price', uploadData.price);
      formData.append('originalPrice', uploadData.originalPrice);
      formData.append('pages', uploadData.pages);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadStatus('success');
        setUploadData({
          title: '',
          subtitle: '',
          description: '',
          price: '',
          originalPrice: '',
          pages: '',
          pdf: null
        });
        fetchProducts();
        
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadStatus('idle');
        }, 2000);
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        fetchProducts();
        alert('Product deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
    }
  };

  useEffect(() => {
    if (activeTab === 'products' && isLoggedIn) {
      fetchProducts();
    }
  }, [activeTab, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="admin@pianolearn.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Login to Admin Panel
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              Demo credentials: admin@pianolearn.com / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">PianoLearn Management</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: FileText },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'subscribers', label: 'Subscribers', icon: Mail }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardStats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalPurchases}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${dashboardStats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Subscribers</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalSubscribers}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Purchases</h3>
                <div className="space-y-4">
                  {dashboardStats.recentPurchases.map((purchase, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{purchase.product_id?.title}</p>
                        <p className="text-sm text-gray-600">{purchase.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${purchase.price}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  {dashboardStats.recentMessages.map((message, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{message.name}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          message.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {message.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{message.subject}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Upload New PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.subtitle}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500">Price</p>
                        <p className="font-bold text-purple-600">${product.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Downloads</p>
                        <p className="font-bold text-gray-900">{product.downloads}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pages</p>
                        <p className="font-bold text-gray-900">{product.pages}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rating</p>
                        <p className="font-bold text-gray-900">{product.rating}/5</p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs">
                      Created: {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Messages</h2>
            <p className="text-gray-600">Messages management coming soon...</p>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Newsletter Subscribers</h2>
            <p className="text-gray-600">Subscriber management coming soon...</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Upload New PDF Product</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadData({ ...uploadData, pdf: e.target.files?.[0] || null })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={uploadData.subtitle}
                  onChange={(e) => setUploadData({ ...uploadData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter product subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={uploadData.price}
                    onChange={(e) => setUploadData({ ...uploadData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="9.99"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={uploadData.originalPrice}
                    onChange={(e) => setUploadData({ ...uploadData, originalPrice: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="19.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pages
                  </label>
                  <input
                    type="number"
                    value={uploadData.pages}
                    onChange={(e) => setUploadData({ ...uploadData, pages: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload Product</span>
                    </>
                  )}
                </button>
              </div>

              {uploadStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                  <span>Product uploaded successfully!</span>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                  <span>Upload failed. Please try again.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;