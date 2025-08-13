import { useState, useEffect } from 'react';
import { Menu, X, Code, User, Briefcase, BookOpen, Download, Mail, Sparkles, Award } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'ebooks', label: 'eBooks', icon: Download },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 theme-transition ${
        isScrolled 
          ? `${isDark ? 'bg-dark-900/80' : 'bg-white/80'} backdrop-blur-2xl border-b ${isDark ? 'border-white/10' : 'border-gray-200/50'} shadow-luxury` 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="group cursor-pointer"
          onClick={() => scrollToSection('hero')}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-breathe"></div>
            <div className={`relative bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent text-3xl font-bold font-display flex items-center space-x-2 ${isDark ? '' : 'drop-shadow-sm'}`}>
              <Sparkles className="text-primary-500 group-hover:animate-spin transition-all duration-500" size={28} />
              <span className="group-hover:scale-110 transition-transform duration-300">NG</span>
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`group relative px-4 py-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-all duration-300 font-medium theme-transition`}
              >
                <span className="relative z-10">{item.label}</span>
                <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${isDark ? '' : 'shadow-elegant'}`}></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-500"></div>
              </button>
            </li>
          ))}
        </ul>

        {/* Theme Toggle & CTA */}
        <div className="hidden lg:flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => scrollToSection('contact')}
            className={`group relative px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 ${isDark ? 'shadow-glow' : 'shadow-luxury'}`}
          >
            <span className="relative z-10">Let's Talk</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-3">
          <ThemeToggle />
          <button
            className={`relative z-50 p-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300 theme-transition`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute inset-0 transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-0' : 'rotate-0 -translate-y-2'}`}>
                <Menu size={24} className={isMenuOpen ? 'opacity-0' : 'opacity-100'} />
              </span>
              <span className={`absolute inset-0 transition-all duration-500 ${isMenuOpen ? 'rotate-0 translate-y-0' : 'rotate-45 translate-y-2'}`}>
                <X size={24} className={isMenuOpen ? 'opacity-100' : 'opacity-0'} />
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-700 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className={`absolute inset-0 ${isDark ? 'bg-dark-950/95' : 'bg-white/95'} backdrop-blur-2xl theme-transition`} onClick={() => setIsMenuOpen(false)} />
          <div className={`absolute right-0 top-0 h-full w-80 ${isDark ? 'bg-dark-900/95' : 'bg-white/95'} backdrop-blur-2xl border-l ${isDark ? 'border-white/10' : 'border-gray-200/50'} transform transition-transform duration-700 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } shadow-premium theme-transition`}>
            <div className="pt-24 px-6">
              <ul className="space-y-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id} className={`transform transition-all duration-700 delay-${index * 100}`}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`group w-full flex items-center space-x-4 p-4 ${isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'} rounded-2xl transition-all duration-300 theme-transition`}
                      >
                        <div className={`p-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-xl group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-all duration-300 ${isDark ? '' : 'shadow-elegant'}`}>
                          <Icon size={20} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              
              <div className="mt-8">
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-2xl transition-all duration-500 ${isDark ? 'shadow-glow' : 'shadow-luxury'} hover:scale-105`}
                >
                  Let's Talk
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;