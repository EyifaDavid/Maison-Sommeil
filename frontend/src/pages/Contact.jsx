import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Heart } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    form: false,
    info: false,
    faq: false
  });

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute('data-section');
          setVisibleSections(prev => ({ ...prev, [sectionName]: true }));
        }
      });
    }, observerOptions);

    // Observe sections
    if (heroRef.current) observer.observe(heroRef.current);
    if (formRef.current) observer.observe(formRef.current);
    if (infoRef.current) observer.observe(infoRef.current);
    if (faqRef.current) observer.observe(faqRef.current);

    // Hero section appears immediately
    setVisibleSections(prev => ({ ...prev, hero: true }));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      info: "maisonsommeil@gmail.com",
      subtitle: "We reply within 24 hours"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      info: "+233 (270) 220062",
      subtitle: "Mon-Fri, 9am-6pm GMT"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      info: "123 Dream Street, Sleep City",
      subtitle: "By appointment only"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      info: "9:00 AM - 6:00 PM",
      subtitle: "Monday to Friday"
    }
  ];

  const faqs = [
    {
      question: "What are your shipping times?",
      answer: "We offer free standard shipping (5-7 business days) on orders over $75. Express shipping (2-3 business days) is available for $12."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unworn items with tags attached. Returns are free and easy with our prepaid return labels."
    },
    {
      question: "How do I care for my nightwear?",
      answer: "Machine wash cold with like colors, use gentle detergent, and tumble dry low. Avoid bleach and fabric softeners to maintain fabric quality."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship worldwide. International shipping costs vary by location and typically takes 7-14 business days."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div 
          ref={heroRef}
          data-section="hero"
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            visibleSections.hero 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Get In <span className="text-pink-500">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          <div className="flex items-center justify-center gap-2 text-pink-500">
            <Heart className="w-6 h-6" />
            <span className="text-lg font-medium">Always here to help</span>
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div 
              ref={formRef}
              data-section="form"
              className={`bg-white rounded-3xl p-8 lg:p-12 shadow-xl transition-all duration-800 delay-200 ${
                visibleSections.form 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-12'
              }`}
            >
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Send us a message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="return">Return/Exchange</option>
                    <option value="sizing">Sizing Help</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div 
              ref={infoRef}
              data-section="info"
              className={`transition-all duration-800 delay-400 ${
                visibleSections.info 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-12'
              }`}
            >
              <div className="space-y-6">
                <div className="mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Contact Information
                  </h2>
                  <p className="text-gray-600 text-lg">
                    We're always happy to help. Reach out to us through any of these channels.
                  </p>
                </div>

                {contactInfo.map((item, index) => (
                  <div 
                    key={index} 
                    className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      visibleSections.info 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-6'
                    }`}
                    style={{ 
                      transitionDelay: visibleSections.info ? `${index * 100 + 600}ms` : '0ms' 
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-pink-100 p-3 rounded-xl text-pink-500 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-800 font-medium mb-1">
                          {item.info}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Social Media */}
                <div className={`bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mt-8 transition-all duration-800 ${
                  visibleSections.info 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '1000ms' }}>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Follow Us
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Stay connected for the latest updates, styling tips, and exclusive offers.
                  </p>
                  <div className="flex gap-3">
                    {['Instagram', 'Facebook', 'Twitter'].map((platform) => (
                      <button
                        key={platform}
                        className="bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-pink-50 hover:scale-105 transition-all duration-300"
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div 
            ref={faqRef}
            data-section="faq"
          >
            <div className={`text-center mb-12 transition-all duration-800 ${
              visibleSections.faq 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-800 hover:scale-105 ${
                    visibleSections.faq 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ 
                    transitionDelay: visibleSections.faq ? `${index * 150 + 200}ms` : '0ms' 
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className={`text-center mt-12 transition-all duration-800 delay-1000 ${
              visibleSections.faq 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-gray-600 mb-4">
                Still have questions? We're here to help!
              </p>
              <button className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 hover:scale-105 transition-all duration-300">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}