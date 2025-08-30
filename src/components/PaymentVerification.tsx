import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Download, Clock, Mail } from 'lucide-react';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [productTitle, setProductTitle] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email) {
      verifyPayment();
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token, email]);

  const verifyPayment = async () => {
    try {
      // First, try to confirm the payment automatically
      const response = await fetch(`${import.meta.env.VITE_API_URL}/purchase/verify-upi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          downloadToken: token,
          email: email
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setDownloadUrl(result.downloadUrl);
        setProductTitle(result.productTitle);
      } else {
        setStatus('pending');
        setMessage('Payment verification pending. We\'ll send you the download link once payment is confirmed.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
      setMessage('Failed to verify payment. Please contact support.');
    }
  };

  const handleManualVerification = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/purchase/manual-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          downloadToken: token,
          email: email
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setMessage('Payment confirmed! Check your email for the download link.');
        setDownloadUrl(result.downloadUrl);
        setProductTitle(result.productTitle);
      } else {
        setMessage('Payment verification submitted. We\'ll process it within 24 hours.');
      }
    } catch (error) {
      console.error('Manual verification error:', error);
      setMessage('Failed to submit verification. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we check your payment status</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed! 🎉</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            
            {downloadUrl && (
              <div className="bg-green-50 p-6 rounded-2xl mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">{productTitle}</h3>
                <a
                  href={downloadUrl}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Download Your PDF
                </a>
                <p className="text-sm text-gray-600 mt-3">
                  Download link has also been sent to your email
                </p>
              </div>
            )}
          </div>
        )}

        {status === 'pending' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Pending</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="bg-blue-50 p-6 rounded-2xl mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Already completed payment?</h3>
              <p className="text-gray-600 mb-4">
                If you've already made the UPI payment, click below to confirm and get instant access:
              </p>
              <button
                onClick={handleManualVerification}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                ✅ I've Completed UPI Payment
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>Alternative:</strong> Send payment screenshot to{' '}
                <a href="mailto:support@pianolearn.com" className="text-blue-600 hover:underline">
                  support@pianolearn.com
                </a>{' '}
                with your email ({email}) for manual verification
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Error</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="bg-red-50 p-6 rounded-2xl">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Please contact our support team with your payment details:
              </p>
              <a
                href="mailto:support@pianolearn.com"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;