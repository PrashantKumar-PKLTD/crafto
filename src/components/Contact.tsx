import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@pianolearn.com',
      description: 'Send us an email anytime',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Music Street',
      description: 'Harmony City, HC 12345',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: '24/7 Online Support',
      description: 'We\'re here to help anytime',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const subjects = [
    'General Inquiry',
    'Technical Support',
    'Piano Lessons',
    'PDF Downloads',
    'Billing & Payments',
    'Partnership',
    'Other'
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern animate-pulse-glow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full text-purple-600 font-semibold text-sm mb-4 animate-pulse-glow">
            📞 Get In Touch
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Contact{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our piano courses? Need help with your learning journey? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Let's Start a Conversation</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Whether you're a beginner looking to start your piano journey or an experienced player seeking advanced techniques, 
                our team is ready to assist you with personalized guidance and support.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{info.title}</h4>
                    <p className="text-purple-600 font-semibold mb-1">{info.details}</p>
                    <p className="text-gray-500 text-sm">{info.description}</p>
                  </div>
                );
              })}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">How quickly will I receive a response?</h5>
                  <p className="text-gray-600 text-sm">We typically respond to all inquiries within 24 hours during business days.</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h5>
                  <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee on all our piano courses and materials.</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Can I get personalized piano lessons?</h5>
                  <p className="text-gray-600 text-sm">Absolutely! Contact us to discuss one-on-one piano instruction options.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
              <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                  <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                  <span>Sorry, there was an error sending your message. Please try again or contact us directly.</span>
                </div>
              )}
            </form>

            {/* Privacy Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to our Privacy Policy. We respect your privacy and will never share your information with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;