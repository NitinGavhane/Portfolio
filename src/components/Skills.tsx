import { useState, useEffect, useRef } from 'react';
import { 
  Code, 
  Shield, 
  Database, 
  Cloud, 
  Globe, 
  Terminal,
  Lock,
  Server,
  Smartphone,
  GitBranch,
  Zap,
  Layers
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const skillCategories = [
    {
      title: "Frontend Mastery",
      description: "Creating stunning, responsive user experiences",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "React & Next.js", level: 95, icon: Code },
        { name: "TypeScript", level: 92, icon: Code },
        { name: "Tailwind CSS", level: 90, icon: Layers },
        { name: "Angular Framework", level: 85, icon: Code },
        { name: "Three.js", level: 80, icon: Zap },
      ]
    },
    {
      title: "Backend Excellence", 
      description: "Building scalable, high-performance systems",
      icon: Server,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Node.js", level: 93, icon: Server },
        { name: "Firebase", level: 90, icon: Database },
        { name: "GraphQL", level: 88, icon: Database },
        { name: "Microservices", level: 85, icon: Globe },
        { name: "REST APIs", level: 95, icon: Globe },
      ]
    },
    {
      title: "Cybersecurity",
      description: "Protecting digital assets and infrastructure",
      icon: Shield,
      color: "from-red-500 to-pink-500",
      skills: [
        { name: "Penetration Testing", level: 90, icon: Shield },
        { name: "Security Auditing", level: 88, icon: Lock },
        { name: "Vulnerability Assessment", level: 92, icon: Shield },
        { name: "Network Security", level: 85, icon: Globe },
        { name: "Incident Response", level: 87, icon: Shield },
      ]
    },
    {
      title: "Cloud & DevOps",
      description: "Deploying and scaling modern applications",
      icon: Cloud,
      color: "from-purple-500 to-violet-500",
      skills: [
        { name: "AWS", level: 88, icon: Cloud },
        { name: "Docker", level: 90, icon: Server },
        { name: "Kubernetes", level: 82, icon: Cloud },
        { name: "CI/CD", level: 87, icon: GitBranch },
        { name: "Terraform", level: 80, icon: Cloud },
      ]
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const SkillBar = ({ skill, index, isActive }: { skill: any, index: number, isActive: boolean }) => {
    const Icon = skill.icon;
    
    return (
      <div 
        className={`group transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'}`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} backdrop-blur-sm border rounded-lg group-hover:${isDark ? 'bg-white/10' : 'bg-gray-200'} transition-all duration-300`}>
              <Icon size={16} className="text-primary-500" />
            </div>
            <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium transition-colors duration-300`}>{skill.name}</span>
          </div>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} font-mono transition-colors duration-300`}>{skill.level}%</span>
        </div>
        
        <div className={`relative h-2 ${isDark ? 'bg-white/5' : 'bg-gray-200'} rounded-full overflow-hidden transition-colors duration-300`}>
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-white/10 to-white/5' : 'bg-gradient-to-r from-gray-300 to-gray-200'} rounded-full transition-colors duration-300`}></div>
          <div
            className={`h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000 ease-out ${
              isVisible && isActive ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              width: isVisible && isActive ? `${skill.level}%` : '0%',
              transitionDelay: `${index * 150 + 300}ms`
            }}
          >
            <div className="h-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="skills" ref={sectionRef} className={`py-24 ${isDark ? 'bg-gradient-to-b from-dark-950 to-dark-900' : 'bg-gradient-to-b from-gray-50 to-white'} relative overflow-hidden transition-colors duration-500`}>
      {/* Background Elements */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_70%_80%,rgba(217,70,239,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_70%_80%,rgba(217,70,239,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} backdrop-blur-sm border rounded-full text-sm mb-6 transition-all duration-300`}>
            <Zap size={16} className="text-primary-500" />
            <span>Technical Expertise</span>
          </div>
          
          <h2 className={`text-5xl lg:text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
            Skills & <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Expertise</span>
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed transition-colors duration-300`}>
            A comprehensive toolkit spanning cutting-edge development technologies and advanced cybersecurity practices
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`group relative px-6 py-4 rounded-xl border transition-all duration-300 ${
                  activeCategory === index
                    ? `${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`
                    : `${isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900'}`
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} ${
                    activeCategory === index ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'
                  } transition-opacity duration-300`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{category.title}</div>
                    <div className="text-xs opacity-70">{category.description}</div>
                  </div>
                </div>
                
                {activeCategory === index && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-xl blur-xl"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Skills Display */}
        <div className="max-w-4xl mx-auto">
          <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm border rounded-2xl p-8 overflow-hidden transition-all duration-300`}>
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${skillCategories[activeCategory].color} opacity-5 rounded-2xl`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-8">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${skillCategories[activeCategory].color}`}>
                  {(() => {
                    const Icon = skillCategories[activeCategory].icon;
                    return <Icon size={24} className="text-white" />;
                  })()}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{skillCategories[activeCategory].title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{skillCategories[activeCategory].description}</p>
                </div>
              </div>

              <div className="grid gap-6">
                {skillCategories[activeCategory].skills.map((skill, index) => (
                  <SkillBar 
                    key={skill.name} 
                    skill={skill} 
                    index={index} 
                    isActive={isVisible}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {[
            { label: "Years Experience", value: "2+", icon: Zap },
            { label: "Projects Delivered", value: "5+", icon: Code },
            { label: "Security Audits", value: "25+", icon: Shield },
            { label: "Technologies", value: "20+", icon: Layers },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`group text-center p-6 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-lg hover:shadow-xl'} backdrop-blur-sm border rounded-xl transition-all duration-300 hover:scale-105`}
              >
                <div className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl mb-4 inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} className="text-white" />
                </div>
                <div className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 transition-colors duration-300`}>{stat.value}</div>
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;