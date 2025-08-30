import React, { useEffect, useRef, useState } from "react";
import {
  Download,
  Eye,
  Star,
  FileText,
  X,
  Mail,
  ShoppingCart,
  Check,
  CreditCard,
  QrCode,
} from "lucide-react";

interface PDFProduct {
  id: string;
  title: string;
  subtitle: string;
  image: string;           // can be empty
  price: string | number;  // backend may send number
  originalPrice: string | number;
  rating: number;
  pages: number;
  downloads: number;
  badge: string;
  badgeColor: string;
  preview: string;         // e.g. "/uploads/pdfs/xxx.pdf" or absolute URL
  description: string;
}

const PDFPreview: React.FC = () => {
  const [pdfProducts, setPdfProducts] = useState<PDFProduct[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PDFProduct | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiData, setUpiData] = useState<{
    qrCode: string;
    upiString: string;
    purchaseId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const API = import.meta.env.VITE_API_BASE_URL;                 // http://localhost:5000/api
  const FILES = import.meta.env.VITE_FILE_BASE_URL || "http://localhost:5000";

  // Build a full URL for /uploads paths
  function buildPdfUrl(preview: string) {
    if (!preview) return "";
    if (/^https?:\/\//i.test(preview)) return preview;
    return `${FILES}${preview.startsWith("/") ? "" : "/"}${preview}`;
  }

  function openPreview(p: PDFProduct) {
    // Check if the product is free (price is 0 or "Free")
    const isFree = p.price === 0 || p.price === "0" || p.price === "Free" || p.price === "free";
    
    if (!isFree) {
      // Show payment required message for paid PDFs
      alert("This PDF requires payment to preview. Please purchase to access the full content.");
      return;
    }
    
    const url = buildPdfUrl(p.preview);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    (async () => {
      try {
        if (!API) throw new Error("VITE_API_BASE_URL missing");
        const res = await fetch(`${API}/products`);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        const products: PDFProduct[] = Array.isArray(data?.products) ? data.products : [];
        setPdfProducts(products);
        setVisibleItems(Array(products.length).fill(false));
      } catch (e) {
        console.warn("Products fetch failed:", e);
        setPdfProducts([]);
        setVisibleItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Re-attach observer when list length changes
  useEffect(() => {
    if (!pdfProducts.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.getAttribute("data-index") || 0);
          setVisibleItems((prev) => {
            if (!prev.length || index < 0 || index >= prev.length || prev[index]) return prev;
            const next = [...prev];
            next[index] = true;
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => {
      itemRefs.current.forEach((el) => el && observer.unobserve(el));
      observer.disconnect();
    };
  }, [pdfProducts.length]);

  const handleAddToCart = (product: PDFProduct) => {
    setSelectedProduct(product);
    setShowEmailModal(true);
    setEmail("");
    setIsSuccess(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedProduct) return;
    setIsSubmitting(true);
    try {
      if (!API) throw new Error("VITE_API_BASE_URL missing");
      const res = await fetch(`${API}/purchase/send-payment-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          productId: selectedProduct.id,
          productTitle: selectedProduct.title,
          productPrice: selectedProduct.price,
          productImage: selectedProduct.image,
        }),
      });
      const result = await res.json();
      if (result?.success) {
        setIsSuccess(true);
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (err) {
      console.error("Email sending error:", err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpiPayment = async () => {
    if (!email || !selectedProduct) return;
    setIsSubmitting(true);
    try {
      if (!API) throw new Error("VITE_API_BASE_URL missing");
      const res = await fetch(`${API}/purchase/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          productId: String(selectedProduct.id),
          paymentMethod: "upi",
        }),
      });
      const result = await res.json();
      if (!result?.success) throw new Error(result?.message || "Purchase failed");

      // Show UPI QR code and payment instructions
      setUpiData({
        qrCode: result.upiQRCode,
        upiString: result.upiString,
        purchaseId: result.purchaseId
      });
      setShowUpiModal(true);
      setShowEmailModal(false);
    } catch (err) {
      console.error("Purchase error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpiConfirmation = async () => {
    if (!upiData) return;
    
    try {
      setIsSubmitting(true);
      const confirmRes = await fetch(`${API}/purchase/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId: upiData.purchaseId,
          upiTransactionId: "manual_upi_" + Date.now(),
        }),
      });
      const confirmResult = await confirmRes.json();
      if (confirmResult?.success) {
        setIsSuccess(true);
        setShowUpiModal(false);
        setShowEmailModal(true);
        setTimeout(() => closeModal(), 3000);
      } else {
        alert("Payment confirmation failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      alert("Payment confirmation failed. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowEmailModal(false);
    setShowUpiModal(false);
    setSelectedProduct(null);
    setEmail("");
    setIsSuccess(false);
    setUpiData(null);
  };

  return (
    <>
      <section id="pdf-preview" className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full text-purple-600 font-semibold text-xs md:text-sm mb-4">
              📄 PDF Resources
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              Downloadable PDF Guides
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              Instant access to professional piano learning materials you can download and keep forever
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 min-h-[160px]">
            {/* Loading skeletons */}
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 rounded-3xl border border-gray-100 shadow-sm animate-pulse bg-gray-50" />
              ))}

            {/* Empty state */}
            {!loading && pdfProducts.length === 0 && (
              <div className="col-span-full text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">No PDFs available yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Our admin team is uploading new materials. Please check back soon!
                </p>
              </div>
            )}

            {/* Cards */}
            {pdfProducts.map((product, index) => {
              const isVisible = !!visibleItems[index];
              const imgSrc =
                product.image?.trim() ||
                "https://via.placeholder.com/800x400?text=PDF+Preview";

              const price = product.price ?? 0;
              const original = product.originalPrice ?? "";

              return (
                <div
                  key={product.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  data-index={index}
                  className={`group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={product.title}
                      className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className={`absolute top-3 left-3 ${product.badgeColor} text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg`}>
                      {product.badge || "New"}
                    </div>
                    <div className="absolute top-3 right-3 p-2 bg-red-500 rounded-full shadow-lg">
                      <FileText className="w-4 h-4 text-white" />
                    </div>

                    {/* Preview overlay button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {(() => {
                        const isFree = product.price === 0 || product.price === "0" || product.price === "Free" || product.price === "free";
                        return (
                          <button
                            onClick={() => openPreview(product)}
                            className={`backdrop-blur-sm px-4 py-2 rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center gap-2 ${
                              isFree 
                                ? "bg-white/95 text-purple-600 hover:bg-white" 
                                : "bg-red-500/95 text-white hover:bg-red-600 cursor-not-allowed"
                            }`}
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {isFree ? "Preview" : "Payment Required"}
                            </span>
                          </button>
                        );
                      })()}
                    </div>

                    {/* Pages */}
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-[11px] md:text-xs font-medium">
                      {product.pages ?? 0} pages
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-1">{product.subtitle}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{(product.downloads ?? 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {product.rating ?? 0}
                      </span>
                    </div>

                    {/* Preview link (debug-friendly) */}
                    {(() => {
                      const isFree = product.price === 0 || product.price === "0" || product.price === "Free" || product.price === "free";
                      return (
                        <div className={`mb-4 p-3 rounded-xl break-all ${
                          isFree ? "bg-green-50" : "bg-red-50"
                        }`}>
                          {isFree ? (
                            <a
                              href={buildPdfUrl(product.preview)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-green-700 text-sm font-medium underline hover:text-green-800"
                            >
                              🆓 Open free preview
                            </a>
                          ) : (
                            <div className="text-red-700 text-sm font-medium">
                              🔒 Preview available after purchase
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Price & action */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const isFree = product.price === 0 || product.price === "0" || product.price === "Free" || product.price === "free";
                          return (
                            <>
                              <span className={`text-xl md:text-2xl font-bold ${
                                isFree ? "text-green-600" : "text-purple-600"
                              }`}>
                                {isFree ? "FREE" : price}
                              </span>
                              {!isFree && original && (
                                <span className="text-sm text-gray-500 line-through">
                                  {original}
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {(() => {
                      const isFree = product.price === 0 || product.price === "0" || product.price === "Free" || product.price === "free";
                      return (
                        <button
                          onClick={() => {
                            if (isFree) {
                              // For free PDFs, directly open the preview
                              openPreview(product);
                            } else {
                              // For paid PDFs, show the purchase flow
                              handleAddToCart(product);
                            }
                          }}
                          className={`w-full font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${
                            isFree
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          }`}
                        >
                          {isFree ? (
                            <>
                              <Download className="w-5 h-5" />
                              <span>Download Free</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              <span>Purchase & Download</span>
                            </>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Purchase Required</h3>
                  <p className="text-purple-100 text-sm">Enter your email to continue with payment</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {!isSuccess ? (
                <>
                  {selectedProduct && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-1">{selectedProduct.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{selectedProduct.subtitle}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-purple-600">
                          {selectedProduct.price}
                        </span>
                        {selectedProduct.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {selectedProduct.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleEmailSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address for Download Link
                    </label>
                    <div className="relative mb-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      After UPI payment, we'll send your download link to this email.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Opening UPI Payment...</span>
                        </>
                      ) : (
                        <>
                          <QrCode className="w-5 h-5" />
                          <span>Continue to UPI Payment</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-4 p-3 bg-green-50 rounded-xl">
                    <p className="text-xs text-green-700 text-center">
                      🔒 Secure UPI payment • Instant download after payment
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Successful!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for your UPI payment! We've sent your download link to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Check your inbox for the PDF download link and receipt.
                  </p>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-700">
                      💡 Tip: Check your spam folder if you don’t see the email within 5 minutes
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in relative">
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
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">UPI Payment</h3>
                  <p className="text-green-100 text-sm">Scan QR code or use UPI ID</p>
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
                  <h4 className="font-semibold text-gray-900 mb-3">Scan QR Code</h4>
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl">
                    <img 
                      src={upiData.qrCode} 
                      alt="UPI QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Scan with any UPI app (Google Pay, PhonePe, Paytm, etc.)
                  </p>
                </div>
              )}

              {/* UPI ID Option */}
              <div className="mb-6 p-4 bg-green-50 rounded-xl border-2 border-dashed border-green-300">
                <h4 className="font-semibold text-gray-900 mb-3 text-center">Or Pay via UPI ID</h4>
                <div className="text-center mb-3">
                  <div className="inline-block bg-white px-4 py-2 rounded-lg border">
                    <span className="font-mono text-green-600 font-bold">pianolearn@upi</span>
                  </div>
                </div>
                <div className="text-center mb-3">
                  <p className="text-sm text-gray-600">Amount: <strong className="text-green-600">₹{selectedProduct.price}</strong></p>
                  <p className="text-xs text-gray-500">Reference: {selectedProduct.title.substring(0, 20)}...</p>
                </div>
                
                {/* UPI App Buttons */}
                {upiData.upiString && (
                  <div className="space-y-2">
                    <a
                      href={upiData.upiString}
                      className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-center transition-all duration-300"
                    >
                      📱 Open UPI App
                    </a>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Payment Instructions:</h4>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Complete the UPI payment using QR code or UPI ID</li>
                  <li>2. Take a screenshot of the payment confirmation</li>
                  <li>3. Send the screenshot to support@pianolearn.com</li>
                  <li>4. Include your email ({email}) in the message</li>
                  <li>5. You'll receive the download link within 24 hours</li>
                </ol>
              </div>

              {/* Manual Confirmation Button */}
              <button
                onClick={() => {
                  if (confirm("Have you completed the UPI payment? Click OK to confirm.")) {
                    handlePurchase("upi");
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>I've Completed Payment</span>
              </button>

              <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                <p className="text-xs text-yellow-700 text-center">
                  💡 For instant access, use Razorpay payment option above
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
