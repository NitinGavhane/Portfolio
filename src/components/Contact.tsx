import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Replace handleSubmit with EmailJS integration
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailjs.send(
      'service_9100ozj', // Your Service ID
      'template_hnmon7c', // <-- Replace with your EmailJS Template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
      'VsZ8BsNajLupj5uWM' // <-- Replace with your EmailJS User ID (public key)
    )
    .then((result) => {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, (error) => {
      alert('Failed to send message. Please try again.');
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'nitin.gavhane.dev@gmail.com',
      href: 'mailto:nitin.gavhane.dev@gmail.com',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 7972068932',
      href: 'tel:+917972068932',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Maharashtra, India',
      href: '#',
      gradient: 'from-purple-500 to-violet-500'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/NitinGavhane',
      color: 'hover:text-gray-300',
      gradient: 'from-gray-600 to-gray-800'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/nitinsgavhane/',
      color: 'hover:text-blue-400',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://x.com/NitinGavhane_',
      color: 'hover:text-blue-300',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      icon: MessageCircle,
      label: 'Discord',
      href: '#',
      color: 'hover:text-purple-400',
      gradient: 'from-purple-600 to-purple-800'
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className={`py-24 ${isDark ? 'bg-gradient-to-b from-dark-950 to-dark-900' : 'bg-gradient-to-b from-gray-50 to-white'} relative overflow-hidden transition-colors duration-500`}>
      {/* Background Elements */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_30%_40%,rgba(14,165,233,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_30%_40%,rgba(14,165,233,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_70%_60%,rgba(217,70,239,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_70%_60%,rgba(217,70,239,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} backdrop-blur-sm border rounded-full text-sm mb-6 transition-all duration-300`}>
            <Zap size={16} className="text-primary-500" />
            <span>Let's Connect</span>
          </div>
          
          <h2 className={`text-5xl lg:text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
            Get In <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed transition-colors duration-300`}>
            Ready to discuss your next project or explore collaboration opportunities? Let's create something extraordinary together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div>
              <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
                Let's Build Something <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Amazing</span>
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed mb-8 text-lg transition-colors duration-300`}>
                I'm passionate about tackling complex challenges and delivering innovative solutions. 
                Whether it's full-stack development, cybersecurity consulting, or cutting-edge tech projects, 
                I'm here to help bring your vision to life.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map(({ icon: Icon, label, value, href, gradient }, index) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') || href.startsWith('tel:') ? '_self' : '_blank'}
                  rel={href.startsWith('mailto:') || href.startsWith('tel:') ? '' : 'noopener noreferrer'}
                  className={`group relative flex items-center space-x-4 p-6 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-lg hover:shadow-xl'} backdrop-blur-sm border rounded-xl transition-all duration-300 hover:scale-105 ${
                    isVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium transition-colors duration-300`}>{label}</div>
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-lg transition-colors duration-300`}>{value}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
                Follow My Journey
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map(({ icon: Icon, label, href, gradient }, index) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative w-14 h-14 ${isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20' : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'} backdrop-blur-sm border rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                      isVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    aria-label={label}
                  >
                    <Icon size={20} />
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm border rounded-2xl p-8 overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} transition-all duration-300`} style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5"></div>
            <div className="relative z-10">
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
                Send a Message
              </h3>

              <form onSubmit={sendEmail} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} backdrop-blur-sm border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300`}
                  
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} backdrop-blur-sm border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} backdrop-blur-sm border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300`}
                    placeholder="Project Discussion"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-300`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} backdrop-blur-sm border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none`}
                    placeholder="Tell me about your project, goals, and how I can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="group relative w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-glow"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Send size={18} className="mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;