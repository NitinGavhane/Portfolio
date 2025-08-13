import { useState, useRef, useEffect } from 'react';
import { Download, BookOpen, Star, Users, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const EBooks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const ebooks = [
    {
      id: 1,
      title: "The Angular Developer’s Handbook",
      description: "Are you looking to sharpen your Angular skills and build powerful web applications? The Angular Developer's Handbook is your all-in-one guide, covering everything from fundamental concepts to advanced techniques. Whether you're a beginner or an experienced developer, this book provides hands-on examples, best practices, and real-world scenarios to help you master Angular efficiently.",
      cover: "https://m.media-amazon.com/images/I/61qdFLcJLXL._SY385_.jpg",
      pages: 104,
      downloads: 3,
      rating: 4.9,
      price: "260₹",
      downloadLink: "https://www.amazon.in/Angular-Developers-Handbook-Freelance-Practices-ebook/dp/B0F1M4FRQ9",
      featured: true,
      bestseller: true,
      gradient: "from-red-500 to-pink-500"
    }
  ];

  const displayedBooks = ebooks.slice(0, 6);

  return (
    <section id="ebooks" ref={sectionRef} className={`py-24 ${isDark ? 'bg-gradient-to-b from-dark-900 to-dark-950' : 'bg-gradient-to-b from-white to-gray-50'} relative overflow-hidden transition-colors duration-500`}>
      {/* Background Elements */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_25%_25%,rgba(14,165,233,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_25%_25%,rgba(14,165,233,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_75%_75%,rgba(217,70,239,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_75%_75%,rgba(217,70,239,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} backdrop-blur-sm border rounded-full text-sm mb-6 transition-all duration-300`}>
            <BookOpen size={16} className="text-primary-500" />
            <span>Digital Publications</span>
          </div>
          
          <h2 className={`text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
            Published <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">eBooks</span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed transition-colors duration-300`}>
            Comprehensive guides and handbooks on cutting-edge cybersecurity practices and modern development
          </p>
        </div>

        {/* eBooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedBooks.map((book, index) => (
            <div
              key={book.id}
              className={`group relative ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-lg hover:shadow-xl'} backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${book.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Cover Image */}
              <div className="relative w-full h-64 overflow-hidden flex justify-center items-center bg-gray-100">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div
                  className={`absolute inset-0 ${
                    isDark
                      ? 'bg-gradient-to-t from-dark-900/80 via-transparent to-transparent'
                      : 'bg-gradient-to-t from-white/80 via-transparent to-transparent'
                  } transition-colors duration-300`}
                ></div>


                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {book.bestseller && (
                    <div className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                      Bestseller
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className={`absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 ${isDark ? 'bg-black/50' : 'bg-white/80'} backdrop-blur-sm rounded-full text-xs ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                  <Star size={10} className="text-yellow-400" />
                  <span>{book.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-accent-500 group-hover:bg-clip-text' : 'text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-accent-500 group-hover:bg-clip-text'} mb-2 transition-all duration-300 line-clamp-2`}>
                  {book.title}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 leading-relaxed line-clamp-3 transition-colors duration-300`}>
                  {book.description}
                </p>

                {/* Meta Info */}
                <div className={`flex items-center justify-between text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-3 transition-colors duration-300`}>
                  <span className="flex items-center">
                    <BookOpen size={10} className="mr-1" />
                    {book.pages}p
                  </span>
                  <span className="flex items-center">
                    <Users size={10} className="mr-1" />
                    {(book.downloads / 1000).toFixed(1)}k
                  </span>
                  <span className="flex items-center">
                    <TrendingUp size={10} className="mr-1" />
                    Popular
                  </span>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                    {book.price}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => window.open(book.downloadLink, "_blank")}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:shadow-glow transition-all duration-300 text-sm group/btn"
                >
                  <span className="flex items-center justify-center">
                    <Download size={14} className="mr-1" />
                    {book.price === 'Free' ? 'Download' : 'Purchase'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {ebooks.length > 6 && (
          <div className="text-center mb-16">
            <button className={`group relative px-8 py-3 ${isDark ? 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30' : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200 hover:border-gray-300'} backdrop-blur-sm border font-semibold rounded-xl transition-all duration-300 hover:scale-105`}>
              <span className="flex items-center">
                View All eBooks ({ebooks.length})
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </span>
            </button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm border rounded-2xl p-8 text-center overflow-hidden transition-all duration-300`}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10"></div>
          <div className="relative z-10">
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
              Get Notified of <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">New Releases</span>
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 max-w-xl mx-auto transition-colors duration-300`}>
              Be the first to access new eBooks, exclusive content, and special discounts on premium publications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} backdrop-blur-sm border rounded-xl focus:outline-none focus:border-primary-500 transition-all duration-300`}
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EBooks;