import React, { useState } from 'react';
import { X, Download, QrCode, Check, Mail, Smartphone } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  pdfUrl: string;
  description: string;
}

interface PDFPreviewProps {
  product?: Product;
  onClose?: () => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ product, onClose }) => {
  // Return null if product is not provided
  if (!product || !onClose) {
    return null;
  }

  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const isFree = product.price === '0' || product.price === 'Free' || product.price === 'free' || product.price === '0';

  const handleDownload = () => {
    if (isFree) {
      // For free PDFs, open directly
      window.open(product.pdfUrl, '_blank');
    } else {
      // For paid PDFs, show email form
      setShowEmailForm(true);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/purchase/send-payment-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          productId: product.id,
          productTitle: product.title,
          productPrice: product.price,
          productImage: product.image,
          pdfUrl: product.pdfUrl
        }),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowEmailForm(false);
    setEmailSent(false);
    setEmail('');
    onClose();
  };

  return (
    <>
      {/* Main Product Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white/20"
              />
              <div>
                <h3 className="text-2xl font-bold">{product.title}</h3>
                <p className="text-purple-100">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid md:grid-cols-2 gap-6">
              {/* PDF Preview */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">PDF Preview</h4>
                
                {isFree ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Download className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-green-700 font-medium mb-3">🆓 This PDF is free to download!</p>
                      <button
                        onClick={handleDownload}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
                      >
                        <Download className="w-5 h-5" />
                        Open Free Preview
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <QrCode className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="text-red-700 font-medium mb-3">🔒 Preview available after purchase</p>
                      <p className="text-sm text-red-600">Complete payment to access this PDF</p>
                    </div>
                  </div>
                )}

                {/* PDF Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">What you'll get:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>High-quality PDF download</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Instant access after payment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Lifetime access to your purchase</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Mobile and desktop compatible</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Purchase Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {isFree ? 'FREE' : `₹${product.price}`}
                  </div>
                  <p className="text-gray-600">
                    {isFree ? 'Download now at no cost' : 'One-time purchase'}
                  </p>
                </div>

                <button
                  onClick={handleDownload}
                  className={`w-full font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group ${
                    isFree 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isFree ? (
                    <>
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Download Free</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Get UPI QR Code</span>
                    </>
                  )}
                </button>

                {!isFree && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Secure UPI Payment</span>
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <span>Google Pay</span>
                      <span>•</span>
                      <span>PhonePe</span>
                      <span>•</span>
                      <span>Paytm</span>
                      <span>•</span>
                      <span>BHIM</span>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-sm font-medium">Secure & Instant Download</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Form Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">UPI Payment</h3>
                  <p className="text-green-100 text-sm">Get QR code via email</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {!emailSent ? (
                <>
                  <div className="mb-6 text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Enter Your Email</h4>
                    <p className="text-gray-600 text-sm">We'll send you a UPI QR code to complete payment</p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !email.trim()}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending QR Code...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          <span>Send UPI QR Code</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-4 p-3 bg-green-50 rounded-xl">
                    <p className="text-xs text-green-700 text-center">
                      📧 You'll receive an email with UPI QR code for instant payment
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent Successfully!</h3>
                  <p className="text-gray-600 mb-4">
                    We've sent the UPI QR code to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Check your inbox for the QR code and payment instructions.
                  </p>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-700">
                      💡 Click the verification button in the email after payment to get instant download access
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFPreview;