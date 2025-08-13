import { Heart, ArrowUp, Sparkles, Code, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { name: 'About', href: '#about' },
      { name: 'Projects', href: '#projects' },
      { name: 'Blog', href: '#blog' },
      { name: 'Contact', href: '#contact' }
    ],
    'Resources': [
      { name: 'eBooks', href: '#ebooks' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Sitemap', href: '#' }
    ],
    'Services': [
      { name: 'Full-Stack Development', href: '#' },
      { name: 'Cybersecurity Consulting', href: '#' },
      { name: 'Code Auditing', href: '#' },
      { name: 'Technical Writing', href: '#' }
    ]
  };

  return (
    <footer className={`relative ${isDark ? 'bg-gradient-to-b from-dark-900 to-dark-950 border-white/10' : 'bg-gradient-to-b from-gray-50 to-white border-gray-200'} border-t overflow-hidden transition-colors duration-500`}>
      {/* Background Elements */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.03),transparent_50%)]' : 'bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.01),transparent_50%)]'} transition-opacity duration-500`}></div>
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.03),transparent_50%)]' : 'bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.01),transparent_50%)]'} transition-opacity duration-500`}></div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="group mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent text-4xl font-bold flex items-center space-x-3">
                  <Sparkles className="text-primary-500" size={32} />
                  <span>NG</span>
                </div>
              </div>
            </div>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed mb-8 max-w-md text-lg transition-colors duration-300`}>
              Full-Stack Developer & Cybersecurity Researcher passionate about building 
              secure, innovative solutions that push the boundaries of technology.
            </p>
            
            {/* Tech Stack Icons */}
            <div className="flex items-center space-x-4 mb-6">
              <div className={`p-3 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'} backdrop-blur-sm border rounded-xl transition-all duration-300 group`}>
                <Code size={20} className="text-primary-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className={`p-3 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'} backdrop-blur-sm border rounded-xl transition-all duration-300 group`}>
                <Shield size={20} className="text-accent-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className={`p-3 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'} backdrop-blur-sm border rounded-xl transition-all duration-300 group`}>
                <Sparkles size={20} className="text-primary-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm transition-colors duration-300`}>
              <span>Crafted with</span>
              <Heart size={16} className="mx-2 text-red-500 animate-pulse" />
              <span>using React, TypeScript & Modern Web Technologies</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 text-lg transition-colors duration-300`}>
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} hover:translate-x-1 transition-all duration-300 inline-block`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm border rounded-2xl p-8 mb-12 overflow-hidden transition-all duration-300`}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5"></div>
          <div className="relative z-10 text-center">
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
              Stay Updated with Latest <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Innovations</span>
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 max-w-2xl mx-auto transition-colors duration-300`}>
              Get exclusive insights, early access to new projects, and cutting-edge tech updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className={`flex-1 px-4 py-3 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} backdrop-blur-sm border rounded-xl focus:outline-none focus:border-primary-500 transition-all duration-300`}
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'} pt-8 flex flex-col md:flex-row justify-between items-center transition-colors duration-300`}>
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 md:mb-0 transition-colors duration-300`}>
            © {currentYear} Nitin Gavhane. All rights reserved. Built with passion for innovation.
          </div>
          
          <button
            onClick={scrollToTop}
            className={`group flex items-center space-x-2 px-4 py-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20' : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200 hover:border-gray-300'} backdrop-blur-sm border rounded-xl transition-all duration-300 hover:scale-105`}
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;