import { useState, useRef, useEffect } from 'react';
import { Award, Trophy, Shield, ExternalLink, Star, Target, Users, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Achievements = () => {
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

  const handleHallOfFameClick = () => {
    window.open('https://bugcrowd.com/NitinGavhane', '_blank', 'noopener,noreferrer');
  };

  const achievements = [
    {
      title: "1000+ Security Issues",
      description: "Reported critical vulnerabilities to top organizations",
      icon: Shield,
      gradient: "from-red-500 to-pink-500",
      value: "1000+",
      category: "Security Research"
    },
    {
      title: "Hall of Fame",
      description: "Recognized by renowned organizations worldwide",
      icon: Trophy,
      gradient: "from-yellow-500 to-orange-500",
      value: "Multiple",
      category: "Recognition"
    },
    {
      title: "Bug Bounty Hunter",
      description: "Active contributor to cybersecurity community",
      icon: Target,
      gradient: "from-green-500 to-emerald-500",
      value: "Elite",
      category: "Community"
    },
    {
      title: "Industry Impact",
      description: "Helping secure digital infrastructure globally",
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-500",
      value: "Global",
      category: "Impact"
    }
  ];

  const organizations = [
    "Under Armour", "TripAdvisor", "Indeed", "Dell", "Mastercard", "Cloudways", "Etsy"
  ];

  return (
    <section id="achievements" ref={sectionRef} className={`py-24 ${isDark ? 'bg-gradient-to-b from-dark-950 to-dark-900' : 'bg-gradient-to-b from-gray-50 to-white'} relative overflow-hidden transition-colors duration-500`}>
      {/* Background Elements */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_25%_25%,rgba(14,165,233,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_25%_25%,rgba(14,165,233,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_75%_75%,rgba(217,70,239,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_75%_75%,rgba(217,70,239,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} backdrop-blur-sm border rounded-full text-sm mb-6 transition-all duration-300`}>
            <Award size={16} className="text-primary-500" />
            <span>Recognition & Impact</span>
          </div>
          
          <h2 className={`text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Achievements</span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed transition-colors duration-300`}>
            Recognized for exceptional contributions in cybersecurity and vulnerability research
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={`group relative glass-card p-6 transition-all duration-300 hover:scale-105 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl`}></div>
                
                <div className="relative z-10">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${achievement.gradient} mb-4 inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-300`}>
                    {achievement.value}
                  </div>
                  
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-300`}>
                    {achievement.title}
                  </h3>
                  
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 transition-colors duration-300`}>
                    {achievement.description}
                  </p>
                  
                  <div className={`text-xs px-2 py-1 ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full inline-block transition-colors duration-300`}>
                    {achievement.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hall of Fame Section with Glass Background */}
        <div className="relative glass-hall-of-fame animate-glass-shimmer p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                  <Trophy size={32} className="text-white" />
                </div>
                <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                  Hall of Fame
                </h3>
              </div>
              
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
                Recognized by renowned organizations for exceptional contributions in identifying vulnerabilities and bugs
              </p>
              
              <div className={`inline-flex items-center space-x-2 px-4 py-2 glass-card text-sm transition-colors duration-300`}>
                <Shield size={16} className="text-primary-500" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Reported over 1000+ security issues to top organizations
                </span>
              </div>
            </div>

            {/* Organizations List */}
            <div className="mb-8">
              <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 text-center transition-colors duration-300`}>
                Featured Organizations
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                {organizations.map((org, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 glass-card text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {org}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hall of Fame Image - Clickable with Glass Effect */}
            <div className="text-center">
              <button
                onClick={handleHallOfFameClick}
                className="group relative inline-block glass-card p-4 transition-all duration-300 hover:scale-105 hover:shadow-glow"
                aria-label="View Bugcrowd Hall of Fame Profile"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src="/image.png"
                    alt="Hall of Fame - Bugcrowd Profile"
                    className="w-full max-w-2xl h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Click Indicator with Glass Effect */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="glass-card p-4 rounded-full">
                      <ExternalLink size={24} className={isDark ? 'text-white' : 'text-gray-900'} />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`font-semibold ${isDark ? 'text-white group-hover:text-primary-400' : 'text-gray-900 group-hover:text-primary-600'} transition-colors duration-300`}>
                      View Full Profile
                    </span>
                    <ExternalLink size={16} className="text-primary-500 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1 transition-colors duration-300`}>
                    bugcrowd.com/NitinGavhane
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action with Glass Effect */}
        <div className="text-center mt-16">
          <div className="glass-card inline-flex items-center space-x-2 px-6 py-3 transition-colors duration-300">
            <Users size={16} className="text-primary-500" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Interested in collaboration? Let's discuss how I can help secure your organization.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;