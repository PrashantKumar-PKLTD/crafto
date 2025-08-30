y-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Payment Email...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          <span>Send UPI Payment Email</span>
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
                    We've sent the UPI payment QR code to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Check your inbox for the payment instructions and QR code.
                  </p>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-700">
                      💡 Scan the QR code in the email to complete your UPI payment
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPI Payment Modal */}
      {showUpiModal && upiData && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in relative max-h-[90vh] overflow-y-auto">
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
                  <p className="text-green-100 text-sm">Scan QR code with any UPI app</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Product Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-1">{selectedProduct.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">₹{selectedProduct.price}</span>
                  <span className="text-sm text-gray-600">to {email}</span>
                </div>
              </div>

              {/* QR Code */}
              {upiData.qrCode && (
                <div className="text-center mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">📱 Scan QR Code to Pay</h4>
                  <div className="inline-block p-6 bg-white border-2 border-green-200 rounded-2xl shadow-lg">
                    <img 
                      src={upiData.qrCode} 
                      alt="UPI QR Code"
                      className="w-56 h-56 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Open any UPI app and scan this QR code
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <span className="text-xs text-gray-500">Google Pay</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">PhonePe</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">Paytm</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">BHIM</span>
                  </div>
                </div>
              )}

              {/* Payment Amount */}
              <div className="text-center mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">Payment Amount</h4>
                <div className="text-3xl font-bold text-green-600 mb-1">₹{selectedProduct.price}</div>
                <p className="text-sm text-gray-600">for {selectedProduct.title}</p>
              </div>

              {/* Alternative UPI ID */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-dashed border-blue-300">
                <h4 className="font-semibold text-gray-900 mb-3 text-center">💰 Or Pay via UPI ID</h4>
                <div className="text-center mb-3">
                  <p className="text-sm text-gray-600 mb-2">Send ₹{selectedProduct.price} to:</p>
                  <div className="inline-block bg-white px-4 py-3 rounded-lg border border-blue-200">
                    <span className="font-mono text-blue-600 font-bold text-lg">pianolearn@upi</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Reference: {selectedProduct.title.substring(0, 25)}...</p>
                </div>
              </div>

              {/* UPI App Direct Links */}
              {upiData.upiString && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-center">🚀 Quick Pay</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`googlepay://upi/pay?${new URL(upiData.upiString).search.substring(1)}`}
                      className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 text-sm font-medium"
                    >
                      📱 Google Pay
                    </a>
                    <a
                      href={`phonepe://pay?${new URL(upiData.upiString).search.substring(1)}`}
                      className="flex items-center justify-center gap-2 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300 text-sm font-medium"
                    >
                      📱 PhonePe
                    </a>
                    <a
                      href={`paytmmp://pay?${new URL(upiData.upiString).search.substring(1)}`}
                      className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 text-sm font-medium"
                    >
                      📱 Paytm
                    </a>
                    <a
                      href={upiData.upiString}
                      className="flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 text-sm font-medium"
                    >
                      📱 Other UPI
                    </a>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  <span>Payment Steps:</span>
                </h4>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Scan the QR code or click a UPI app button above</li>
                  <li>Complete the payment of ₹{selectedProduct.price}</li>
                  <li>Click "I've Completed Payment" below</li>
                  <li>You'll receive the download link at {email}</li>
                </ol>
              </div>

              {/* Confirmation Button */}
              <button
                onClick={handleUpiConfirmation}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Confirming Payment...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>I've Completed Payment</span>
                  </>
                )}
              </button>

              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-600 text-center">
                  💡 Having trouble? Send payment screenshot to support@pianolearn.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFPreview;