import { useState, useEffect } from 'react';
import { ChevronDown, Github, Linkedin, Twitter, ExternalLink, Sparkles, Code, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ParallaxSection from './ParallaxSection';
import SchedulingModal from './scheduling/SchedulingModal';

const Hero = () => {
  const { isDark } = useTheme();
  const roles = [
    "Full-Stack Developer",
    "Cybersecurity Expert", 
    "Tech Innovator",
    "Solution Architect"
  ];
  
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);

  useEffect(() => {
    const currentText = roles[currentRole];
    
    if (isTyping) {
      if (displayText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        setCurrentRole((prev) => (prev + 1) % roles.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, currentRole, roles]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = '/Nitin_Gavhane_SDE_CV_2025.pdf';
    link.download = 'Nitin_Gavhane_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isDark 
          ? 'bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950' 
          : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
      }`}>
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)]' 
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_50%)]'
        }`}></div>
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.1),transparent_50%)]' 
            : 'bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.05),transparent_50%)]'
        }`}></div>
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.05),transparent_50%)]' 
            : 'bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.03),transparent_50%)]'
        }`}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${isDark ? 'bg-primary-500' : 'bg-primary-400'} rounded-full animate-float opacity-60`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 lg:space-y-8 animate-fade-in-up order-2 lg:order-1">
            <div className="space-y-4 lg:space-y-6">
              <div className={`inline-flex items-center space-x-2 px-3 py-2 sm:px-4 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100/80 border-gray-200/50'
              } backdrop-blur-xl border rounded-full text-xs sm:text-sm transition-all duration-500 hover:scale-105 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <Sparkles size={14} className="text-primary-500 animate-pulse" />
                <span>Available for new opportunities</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className={`block ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-500 mb-2`}>Hi, I'm</span>
                <span className="block bg-gradient-to-r from-primary-500 via-accent-500 to-primary-400 bg-clip-text text-transparent animate-gradient bg-300% bg-size-300">
                  Nitin Gavhane
                </span>
              </h1>
              
              <div className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[3.5rem] flex items-center justify-center lg:justify-start ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-500`}>
                <span className="mr-2 sm:mr-3">I'm a</span>
                <div className="relative">
                  <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent font-semibold inline-block min-w-[200px] sm:min-w-[250px] lg:min-w-[320px]">
                    {displayText}
                    <span className="animate-blink border-r-2 border-primary-500 ml-1"></span>
                  </span>
                </div>
              </div>
            </div>

            <p className={`text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed transition-colors duration-500 mx-auto lg:mx-0 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Crafting secure, scalable digital experiences with cutting-edge technology. 
              I bridge the gap between innovative development and robust cybersecurity to deliver 
              exceptional solutions that drive business growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <button 
                onClick={() => setIsSchedulingOpen(true)}
                className={`group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 ${
                  isDark ? 'shadow-glow-lg' : 'shadow-luxury'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Schedule a Call
                  <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
              </button>
              
              <button 
                onClick={downloadCV}
                className={`group relative px-6 sm:px-8 py-3 sm:py-4 ${
                isDark ? 'bg-white/5 border-white/20 text-white hover:bg-white/10' : 'bg-gray-100/80 border-gray-200/50 text-gray-900 hover:bg-gray-200/80'
              } backdrop-blur-xl border font-semibold rounded-2xl transition-all duration-500 hover:scale-105 ${
                isDark ? 'shadow-glass' : 'shadow-elegant'
              }`}
              >
                <span className="flex items-center justify-center">
                  Download CV
                  <div className="ml-2 p-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full">
                    <ExternalLink size={14} />
                  </div>
                </span>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 sm:space-x-6 justify-center lg:justify-start pt-4">
              {[
                { Icon: Github, href: 'https://github.com/NitinGavhane', gradient: 'from-gray-600 to-gray-800' },
                { Icon: Linkedin, href: 'https://www.linkedin.com/in/nitinsgavhane/', gradient: 'from-blue-600 to-blue-800' },
                { Icon: Twitter, href: 'https://x.com/NitinGavhane_', gradient: 'from-blue-400 to-blue-600' },
              ].map(({ Icon, href, gradient }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-2 sm:p-3 ${
                    isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20' : 'bg-gray-100/80 border-gray-200/50 text-gray-600 hover:bg-gray-200/80 hover:border-gray-300/50'
                  } backdrop-blur-xl border rounded-2xl transition-all duration-500 hover:scale-110 ${
                    isDark ? 'shadow-glass' : 'shadow-elegant'
                  }`}
                  aria-label={`${Icon.name} profile`}
                >
                  <Icon size={18} className="group-hover:text-primary-500 transition-colors duration-300" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </a>
              ))}
            </div>
          </div>

          {/* Profile Image - Optimized for Large Screens */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in-up order-1 lg:order-2" style={{ animationDelay: '0.3s' }}>
            <div className="relative group">
              {/* Container with responsive positioning */}
              <div className="relative transform transition-transform duration-700 
                            xl:translate-x-[-15%] xl:translate-y-[-15%] 
                            2xl:translate-x-[-12%] 2xl:translate-y-[-12%]
                            lg:translate-x-0 lg:translate-y-0">
                
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-full border-2 border-primary-500/30 animate-spin-slow"></div>
                <div className="absolute inset-2 sm:inset-4 rounded-full border border-accent-500/30 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }}></div>
                
                {/* Morphing glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-2xl group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-all duration-700 animate-morph"></div>
                
                {/* Image Container with Aspect Ratio Preservation */}
                <div className={`relative rounded-full overflow-hidden border-4 transition-all duration-700 group-hover:scale-105 ${
                  isDark ? 'border-white/20 group-hover:border-white/30 shadow-luxury' : 'border-gray-200/50 group-hover:border-gray-300/50 shadow-premium'
                }
                  /* Responsive sizing with aspect ratio preservation */
                  w-64 h-64 
                  sm:w-80 sm:h-80 
                  lg:w-96 lg:h-96
                  xl:w-[28rem] xl:h-[28rem]
                  2xl:w-[32rem] 2xl:h-[32rem]
                  /* Ensure perfect circle on all sizes */
                  aspect-square
                `}>
                  <img
                    src="https://ucarecdn.com/b9b8e370-4abd-4d5d-ae15-16eebcfd5ded/51412436"
                    alt="Nitin Gavhane"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    style={{ 
                      objectPosition: 'center center',
                      aspectRatio: '1 / 1'
                    }}
                  />
                  <div className={`absolute inset-0 ${
                    isDark ? 'bg-gradient-to-t from-dark-900/20 via-transparent to-transparent' : 'bg-gradient-to-t from-white/20 via-transparent to-transparent'
                  }`}></div>
                </div>

                {/* Floating badges with responsive positioning */}
                <div className={`absolute rounded-2xl text-white font-semibold animate-float transition-all duration-700 ${
                  isDark ? 'shadow-glow' : 'shadow-luxury'
                }
                  /* Responsive badge positioning */
                  -top-2 -right-2 p-2
                  sm:-top-4 sm:-right-4 sm:p-3
                  xl:-top-6 xl:-right-6 xl:p-4
                  bg-gradient-to-r from-primary-500 to-accent-500
                `}>
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6" />
                </div>
                
                <div className={`absolute rounded-2xl text-white font-semibold animate-float transition-all duration-700 ${
                  isDark ? 'shadow-glow' : 'shadow-luxury'
                }
                  /* Responsive badge positioning */
                  -bottom-2 -left-2 p-2
                  sm:-bottom-4 sm:-left-4 sm:p-3
                  xl:-bottom-6 xl:-left-6 xl:p-4
                  bg-gradient-to-r from-accent-500 to-primary-500
                `} style={{ animationDelay: '2s' }}>
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className={`absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 p-2 sm:p-3 ${
          isDark ? 'text-gray-400 hover:text-primary-500' : 'text-gray-600 hover:text-primary-500'
        } transition-all duration-500 animate-bounce-slow group`}
        aria-label="Scroll to about section"
      >
        <div className={`p-2 ${
          isDark ? 'bg-white/5 border-white/10 group-hover:bg-white/10 group-hover:border-white/20' : 'bg-gray-100/80 border-gray-200/50 group-hover:bg-gray-200/80 group-hover:border-gray-300/50'
        } backdrop-blur-xl border rounded-full transition-all duration-500 ${
          isDark ? 'shadow-glass' : 'shadow-elegant'
        }`}>
          <ChevronDown size={20} />
        </div>
      </button>

      {/* Scheduling Modal */}
      <SchedulingModal isOpen={isSchedulingOpen} onClose={() => setIsSchedulingOpen(false)} />
    </section>
  );
};

export default Hero;