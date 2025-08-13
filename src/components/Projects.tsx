import { useState, useRef, useEffect } from 'react';
import { Github, ExternalLink, Shield, Code, Database, Globe, Zap, Star, Eye, ArrowRight, Calendar, Users, Award, TrendingUp, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
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

  const projects = [
    {
      id: 1,
      title: "DailyStory",
      description: "Capture and preserve your daily experiences, thoughts, and memories in beautiful stories that you can keep private or share with the world.",
      image: "public/projects_images/DailyStory.png",
      technologies: ["React", "Node.js", "MongoDB", "TypeScript", "Tailwind CSS"],
      category: "fullstack",
      github: "https://github.com/NitinGavhane/DailyStory.git",
      live: "https://daily-story.vercel.app/",
      featured: true,
      stats: { stars: 234, views: "12.5k", commits: 156 },
      gradient: "from-red-500 via-pink-500 to-purple-500",
      status: "Production",
      year: "2025",
      team: 1,
      duration: "3 months"
    },
    {
      id: 2,
      title: "Terminal-style Portfolio (Dependency‑free Typewriter)",
      description: "A minimalist, terminal-inspired personal site that types out your bio and links with a custom typewriter effect.",
      image: "public/projects_images/Terminal-style-Portfolio.png", 
      technologies: ["HTML5", "CSS3", "Vanilla JavaScript","setInterval"],
      category: "fullstack",
      github: "https://github.com/NitinGavhane/nitin.git",
      live: "https://nitin.vercel.app/",
      featured: true,
      stats: { stars: 189, views: "8.7k", commits: 203 },
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      status: "Beta",
      year: "2021",
      team: 1,
      duration: "1 months"
    },
    {
      id: 3,
      title: "Quantum-Safe Encryption",
      description: "Post-quantum cryptography implementation for securing communications against future threats.",
      longDescription: "Revolutionary encryption system designed to withstand attacks from quantum computers, implementing NIST-approved post-quantum cryptographic algorithms.",
      image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Rust", "WebAssembly", "React", "TypeScript", "OpenSSL"],
      category: "security",
      github: "#",
      live: "#",
      featured: false,
      stats: { stars: 156, views: "5.2k", commits: 89 },
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      status: "Research",
      year: "2024",
      team: 2,
      duration: "4 months"
    },
    {
      id: 4,
      title: "Decentralized Social Network",
      description: "Blockchain-based social platform with end-to-end encryption and token economics.",
      longDescription: "A decentralized social media platform built on blockchain technology, featuring user-owned data, cryptocurrency rewards, and censorship-resistant communication.",
      image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Solidity", "React", "IPFS", "Web3.js", "Ethereum"],
      category: "blockchain", 
      github: "#",
      live: "#",
      featured: false,
      stats: { stars: 298, views: "15.1k", commits: 267 },
      gradient: "from-green-500 via-emerald-500 to-cyan-500",
      status: "MVP",
      year: "2023",
      team: 5,
      duration: "10 months"
    },
    {
      id: 5,
      title: "Cloud Security Orchestrator", 
      description: "Automated security compliance and monitoring system for multi-cloud environments.",
      longDescription: "Comprehensive cloud security solution that automatically monitors, detects, and responds to security threats across AWS, Azure, and GCP infrastructures.",
      image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Python", "AWS", "Terraform", "Kubernetes", "Docker"],
      category: "security",
      github: "#",
      live: "#",
      featured: false,
      stats: { stars: 167, views: "6.8k", commits: 134 },
      gradient: "from-orange-500 via-red-500 to-pink-500",
      status: "Production",
      year: "2023",
      team: 3,
      duration: "5 months"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects', icon: Code, count: projects.length },
    { id: 'fullstack', label: 'Full-Stack', icon: Globe, count: projects.filter(p => p.category === 'fullstack').length },
    { id: 'security', label: 'Security', icon: Shield, count: projects.filter(p => p.category === 'security').length },
    { id: 'blockchain', label: 'Blockchain', icon: Database, count: projects.filter(p => p.category === 'blockchain').length },
    { id: 'ai', label: 'AI/ML', icon: Zap, count: projects.filter(p => p.category === 'ai').length },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Production': return 'from-green-500 to-emerald-500';
      case 'Beta': return 'from-blue-500 to-cyan-500';
      case 'MVP': return 'from-yellow-500 to-orange-500';
      case 'Research': return 'from-purple-500 to-violet-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const ProjectCard = ({ project, featured = false }: { project: any, featured?: boolean }) => (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 ${
        featured ? 'col-span-1 md:col-span-2 row-span-2' : 'col-span-1'
      } ${
        isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-lg hover:shadow-2xl'
      } backdrop-blur-sm border`}
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Image Section */}
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-dark-900/90 via-dark-900/50 to-transparent' : 'from-black/60 via-black/30 to-transparent'}`}></div>
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {project.featured && (
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center space-x-1">
              <Award size={12} />
              <span>Featured</span>
            </div>
          )}
          <div className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(project.status)} text-white text-xs font-semibold rounded-full`}>
            {project.status}
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <div className={`flex items-center space-x-1 px-2 py-1 ${isDark ? 'bg-black/50' : 'bg-white/80'} backdrop-blur-sm rounded-full text-xs`}>
            <Star size={10} className="text-yellow-400" />
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{project.stats.stars}</span>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 ${isDark ? 'bg-black/50' : 'bg-white/80'} backdrop-blur-sm rounded-full text-xs`}>
            <Eye size={10} className="text-blue-400" />
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{project.stats.views}</span>
          </div>
        </div>

        {/* Action Buttons - Show on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center space-x-4 transition-all duration-300 ${
          hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
        }`}>
          <a
            href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            className={`p-3 ${isDark ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' : 'bg-black/20 border-white/30 text-white hover:bg-black/30'} backdrop-blur-sm border rounded-full transition-all duration-300 hover:scale-110`}
          >
            <Github size={20} />
          </a>
          <a
            href={project.live}
              target="_blank"
              rel="noopener noreferrer"
            className={`p-3 ${isDark ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' : 'bg-black/20 border-white/30 text-white hover:bg-black/30'} backdrop-blur-sm border rounded-full transition-all duration-300 hover:scale-110`}
          >
            <ExternalLink size={20} />
          </a>
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">
            {project.title}
          </h3>
          {featured && (
            <p className="text-white/80 text-sm line-clamp-2 mb-3">
              {project.longDescription}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {!featured && (
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed line-clamp-3`}>
            {project.description}
          </p>
        )}

        {/* Project Meta Info */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <Calendar size={12} className="text-primary-500" />
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{project.year}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={12} className="text-primary-500" />
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{project.team} members</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp size={12} className="text-primary-500" />
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{project.stats.commits} commits</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={12} className="text-primary-500" />
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{project.duration}</span>
          </div>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, featured ? 5 : 3).map((tech: string, techIndex: number) => (
            <span
              key={techIndex}
              className={`px-2 py-1 ${isDark ? 'bg-white/10 border-white/20 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'} border rounded-md text-xs font-medium transition-colors duration-300`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (featured ? 5 : 3) && (
            <span className={`px-2 py-1 ${isDark ? 'text-gray-500' : 'text-gray-600'} text-xs`}>
              +{project.technologies.length - (featured ? 5 : 3)}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105 group/btn">
          <span className="flex items-center justify-center">
            View Project Details
            <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500 pointer-events-none`}></div>
    </div>
  );

  return (
    <section id="projects" ref={sectionRef} className={`py-24 ${isDark ? 'bg-gradient-to-b from-dark-900 to-dark-950' : 'bg-gradient-to-b from-white to-gray-50'} relative overflow-hidden transition-colors duration-500`}>
      {/* Background Elements */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_80%_70%,rgba(217,70,239,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_80%_70%,rgba(217,70,239,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} backdrop-blur-sm border rounded-full text-sm mb-6 transition-all duration-300`}>
            <Code size={16} className="text-primary-500" />
            <span>Project Showcase</span>
          </div>
          
          <h2 className={`text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
            Featured <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed transition-colors duration-300`}>
            Innovative solutions that push the boundaries of technology and security
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`group relative px-6 py-3 rounded-xl border transition-all duration-300 text-sm ${
                  filter === category.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 border-transparent text-white shadow-glow'
                    : `${isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200 hover:border-gray-300 hover:text-gray-900'}`
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon size={16} />
                  <span className="font-medium">{category.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filter === category.id 
                      ? 'bg-white/20 text-white' 
                      : `${isDark ? 'bg-white/10 text-gray-500' : 'bg-gray-200 text-gray-600'}`
                  } transition-all duration-300`}>
                    {category.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Featured Projects Grid */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>
              🌟 Featured Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProjectCard project={project} featured={true} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Projects Grid */}
        {regularProjects.length > 0 && (
          <div>
            {featuredProjects.length > 0 && (
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>
                More Projects
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${(index + featuredProjects.length) * 100}ms` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        {filteredProjects.length > 6 && (
          <div className="text-center mt-16">
            <button className={`group relative px-8 py-4 ${isDark ? 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30' : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200 hover:border-gray-300'} backdrop-blur-sm border font-semibold rounded-xl transition-all duration-300 hover:scale-105`}>
              <span className="flex items-center">
                View All Projects ({filteredProjects.length})
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;