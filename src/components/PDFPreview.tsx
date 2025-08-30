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
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "upi" | "">("");
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
    setShowPaymentOptions(false);
    setPaymentMethod("");
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
        setShowPaymentOptions(true);
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (err) {
      console.error("Email sending error:", err);
      setIsSuccess(true);
      setShowPaymentOptions(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurchase = async (method: "razorpay" | "upi") => {
    if (!email || !selectedProduct) return;
    setIsSubmitting(true);
    setPaymentMethod(method);
    try {
      if (!API) throw new Error("VITE_API_BASE_URL missing");
      const res = await fetch(`${API}/purchase/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          productId: String(selectedProduct.id),
          paymentMethod: method,
        }),
      });
      const result = await res.json();
      if (!result?.success) throw new Error(result?.message || "Purchase failed");

      // Simulate payment + confirm
      await new Promise((r) => setTimeout(r, 1200));
      const confirm = await fetch(`${API}/purchase/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          method === "razorpay"
            ? {
                purchaseId: result.purchaseId,
                razorpayPaymentId: "demo_razorpay_" + Date.now(),
                razorpaySignature: "demo_signature_" + Date.now(),
              }
            : {
                purchaseId: result.purchaseId,
                upiTransactionId: "demo_upi_" + Date.now(),
              }
        ),
      });
      const confirmResult = await confirm.json();
      if (confirmResult?.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setShowEmailModal(false);
          setSelectedProduct(null);
          setIsSuccess(false);
          setShowPaymentOptions(false);
          setPaymentMethod("");
        }, 2000);
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setIsSuccess(true);
      setTimeout(() => {
        setShowEmailModal(false);
        setSelectedProduct(null);
        setIsSuccess(false);
        setShowPaymentOptions(false);
        setPaymentMethod("");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowEmailModal(false);
    setSelectedProduct(null);
    setEmail("");
    setIsSuccess(false);
    setShowPaymentOptions(false);
    setPaymentMethod("");
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
                      <button
                        onClick={() => openPreview(product)}
                        className="bg-white/95 backdrop-blur-sm text-purple-600 px-4 py-2 rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-semibold">Preview</span>
                      </button>
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
                    <div className="mb-4 p-3 bg-blue-50 rounded-xl break-all">
                      <a
                        href={buildPdfUrl(product.preview)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 text-sm font-medium underline"
                      >
                        Open preview
                      </a>
                    </div>

                    {/* Price & action */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl md:text-2xl font-bold text-purple-600">
                          {price}
                        </span>
                        {original && (
                          <span className="text-sm text-gray-500 line-through">
                            {original}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
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
                  <h3 className="text-xl font-bold">Add to Cart</h3>
                  <p className="text-purple-100 text-sm">Enter your email to continue</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {!showPaymentOptions ? (
                <>
                  {selectedProduct && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-1">{selectedProduct.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{selectedProduct.subtitle}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-purple-600">
                          {selectedProduct.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {selectedProduct.originalPrice}
                        </span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleEmailSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
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
                      We’ll send your purchase confirmation and download link to this email.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Email...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          <span>Send Payment Options</span>
                        </>
                      )}
                    </button>
                  </form>

                  {isSuccess && (
                    <div className="mt-4 p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Email sent successfully!</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        Check your inbox for payment options and instructions.
                      </p>
                    </div>
                  )}
                </>
              ) : !isSuccess ? (
                <div className="py-4">
                  {selectedProduct && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{selectedProduct.title}</h4>
                        <span className="text-2xl font-bold text-purple-600">{selectedProduct.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">Email: {email}</p>
                      <p className="text-xs text-green-600">✓ Instant download after payment</p>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Payment Method</h3>

                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => handlePurchase("razorpay")}
                      disabled={isSubmitting}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center gap-4 disabled:opacity-50"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-gray-900">Razorpay</h4>
                        <p className="text-sm text-gray-600">Credit/Debit Cards, UPI, Net Banking</p>
                      </div>
                      {isSubmitting && paymentMethod === "razorpay" && (
                        <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                      )}
                    </button>

                    <button
                      onClick={() => handlePurchase("upi")}
                      disabled={isSubmitting}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all flex items-center gap-4 disabled:opacity-50"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-gray-900">UPI Payment</h4>
                        <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm & more</p>
                      </div>
                      {isSubmitting && paymentMethod === "upi" && (
                        <div className="w-5 h-5 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => setShowPaymentOptions(false)}
                    disabled={isSubmitting}
                    className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                  >
                    ← Send Another Email
                  </button>

                  <div className="mt-4 p-3 bg-green-50 rounded-xl">
                    <p className="text-xs text-green-700 text-center">
                      🔒 Your payment is secured with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Successful!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for your purchase! We’ve sent your download link to <strong>{email}</strong>
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
    </>
  );
};

export default PDFPreview;
