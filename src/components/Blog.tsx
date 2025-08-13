import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Tag, ArrowRight, TrendingUp, Bookmark, Share2, Eye, ExternalLink, Play, Pause, Volume2, Subtitles } from 'lucide-react';
import ClickableCard from './ClickableCard';
import { useTheme } from '../contexts/ThemeContext';

interface MediumPost {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  pubDate: string;
  categories: string[];
  thumbnail?: string;
  readTime?: string;
  audioUrl?: string; // Add audio URL field
  captionsUrl?: string; // Add captions URL field
}

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mediumPosts, setMediumPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<{ [key: string]: number }>({});
  const [audioDuration, setAudioDuration] = useState<{ [key: string]: number }>({});
  const [showCaptions, setShowCaptions] = useState<{ [key: string]: boolean }>({});
  const [currentCaption, setCurrentCaption] = useState<{ [key: string]: string }>({});
  const [loadedCaptions, setLoadedCaptions] = useState<{ [key: string]: any[] }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
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

  useEffect(() => {
    // Set the predefined blog posts directly
    setMediumPosts(predefinedPosts);
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAudioPlay = (postId: string, audioUrl: string) => {
    // Stop any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== postId) {
      const currentAudio = audioRefs.current[currentlyPlaying];
      if (currentAudio) {
        currentAudio.pause();
      }
    }

    // Encode the URL to handle spaces and special characters
    const encodedAudioUrl = encodeURI(audioUrl);

    // Get or create audio element
    if (!audioRefs.current[postId]) {
      const audio = new Audio(encodedAudioUrl);
      audio.preload = 'metadata';
      
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(prev => ({
          ...prev,
          [postId]: audio.duration
        }));
      });

      audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        setAudioProgress(prev => ({
          ...prev,
          [postId]: currentTime
        }));
        
        // Update captions if enabled
        const caption = getCaptions(postId, currentTime);
        setCurrentCaption(prev => ({
          ...prev,
          [postId]: caption
        }));
      });

      audio.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
        setAudioProgress(prev => ({
          ...prev,
          [postId]: 0
        }));
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio error for post:', postId, 'URL:', encodedAudioUrl, 'Error:', e);
        setCurrentlyPlaying(null);
      });

      audioRefs.current[postId] = audio;
    }

    const audio = audioRefs.current[postId];
    
    if (currentlyPlaying === postId) {
      // Pause current audio
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      // Play audio
      console.log('Attempting to play audio:', encodedAudioUrl);
      audio.play().catch(error => {
        console.error('Audio playback error for post:', postId, 'URL:', encodedAudioUrl, 'Error:', error);
        setCurrentlyPlaying(null);
      });
      setCurrentlyPlaying(postId);
      
    }
  };

  // Predefined blog posts with correct audio URLs matching actual files
  const predefinedPosts: MediumPost[] = [
    {
      id: '1',
      title: "2025 Guide: Run DeepSeek R1 Locally with Ollama in 10 Minutes — Build Your Own AI Web Recon Tool",
      excerpt: "Learn how to set up DeepSeek R1 locally using Ollama and build a powerful AI-powered web reconnaissance tool for cybersecurity professionals.",
      link: "https://medium.com/@nitinsgavane/2025-guide-run-deepseek-r1-locally-with-ollama-in-10-minutes-build-your-own-ai-web-recon-tool-0816335bc48d",
      pubDate: "2025-01-15T10:00:00Z",
      categories: ["AI", "Cybersecurity"],
      thumbnail: "/DeepSeek-R1.png",
      readTime: "10 min read",
      audioUrl: "/prodcast_audio/DeepSeek-R1 Local Setup with Ollama for AI Reconnaissance.wav",
      captionsUrl: "/captions/deepseek-r1.vtt"
    },
    {
      id: '2',
      title: "MongoDB and Node.js Coding Round Questions You Need to Know",
      excerpt: "Essential MongoDB and Node.js interview questions with detailed solutions to help you ace your next coding interview.",
      link: "https://medium.com/@nitinsgavane/mongodb-and-node-js-coding-round-questions-you-need-to-know-c13eb2de8b4e",
      pubDate: "2025-01-12T14:30:00Z",
      categories: ["Development", "Database"],
      thumbnail: "/MN.png",
      readTime: "12 min read",
      audioUrl: "/prodcast_audio/MongoDB and Node_js Interview Essentials.wav",
      captionsUrl: "/captions/mongodb-nodejs.vtt"
    },
    {
      id: '3',
      title: "Node.js Coding Round Success: Must-Know Questions and Solutions",
      excerpt: "Comprehensive guide to Node.js coding interview questions with practical solutions and best practices for backend development.",
      link: "https://medium.com/@nitinsgavane/node-js-coding-round-success-must-know-questions-and-solutions-3f7614d3278b",
      pubDate: "2025-01-10T09:15:00Z",
      categories: ["Development", "Backend"],
      thumbnail: "/Node.png",
      readTime: "15 min read",
      audioUrl: "/prodcast_audio/Node_js Interview Questions and Solutions.wav",
      captionsUrl: "/captions/nodejs-coding.vtt"
    },
    {
      id: '4',
      title: "JDBC CRUD Operations in Spring Boot Maven Project",
      excerpt: "Step-by-step tutorial on implementing JDBC CRUD operations in Spring Boot with Maven, including best practices and code examples.",
      link: "https://medium.com/@nitinsgavane/jdbc-crud-operations-in-spring-boot-maven-project-3dd564cf5f31",
      pubDate: "2025-01-08T16:45:00Z",
      categories: ["Development", "Backend"],
      thumbnail: "/JDBC.png",
      readTime: "18 min read",
      audioUrl: "/prodcast_audio/JDBC CRUD in Spring Boot Maven.wav",
      captionsUrl: "/captions/jdbc-spring-boot.vtt"
    },
    {
      id: '5',
      title: "Angular: Working with JSON Data in Different Scenarios",
      excerpt: "Master JSON data handling in Angular applications with practical examples covering various real-world scenarios and best practices.",
      link: "https://medium.com/@nitinsgavane/angular-working-with-json-data-in-different-scenarios-552947e026bc",
      pubDate: "2025-01-05T11:20:00Z",
      categories: ["Development", "Frontend"],
      thumbnail: "/Angulr.png",
      readTime: "14 min read",
      audioUrl: "/prodcast_audio/Angular_ JSON Data Scenarios.wav",
      captionsUrl: "/captions/angular-json.vtt"
    },
    {
      id: '6',
      title: "From Zero to Firebase: A Hands-On Guide for 2025 Angular Projects",
      excerpt: "Complete guide to integrating Firebase Firestore with Angular applications, covering setup, CRUD operations, and advanced features.",
      link: "https://medium.com/@nitinsgavane/from-zero-to-firestore-a-hands-on-guide-for-2025-angular-projects-1ecc57b6546b",
      pubDate: "2025-01-03T13:10:00Z",
      categories: ["Development", "Frontend"],
      thumbnail: "/Firebase.png",
      readTime: "20 min read",
      audioUrl: "/prodcast_audio/Zero to Firestore_ Angular Project Guide.wav",
      captionsUrl: "/captions/firebase-angular.vtt"
    }
  ];

  const displayedPosts = mediumPosts.slice(0, 6);

  // 🎵 OPTION 1: Soundcloud-style Waveform (Recommended)
  const generateSoundCloudWaveform = (isPlaying: boolean, progress: number) => {
    const bars = [];
    const barCount = 60;
    
    for (let i = 0; i < barCount; i++) {
      // Create realistic audio waveform pattern
      const baseHeight = Math.abs(Math.sin(i * 0.1) * Math.cos(i * 0.05)) * 100;
      const noise = Math.random() * 20;
      const height = Math.min(Math.max(baseHeight + noise, 10), 100);
      const isActive = (i / barCount) * 100 <= progress;
      
      bars.push(
        <div
          key={i}
          className={`w-0.5 rounded-sm transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-t from-orange-500 to-orange-400' 
              : isDark ? 'bg-white/20' : 'bg-gray-300'
          } ${isPlaying && isActive ? 'animate-pulse' : ''}`}
          style={{ 
            height: `${height}%`,
            animationDelay: `${i * 20}ms`,
            animationDuration: '1s'
          }}
        />
      );
    }
    return bars;
  };

  // 🌊 OPTION 2: Modern Frequency Bars
  const generateFrequencyBars = (isPlaying: boolean, progress: number) => {
    const bars = [];
    const barCount = 40;
    
    for (let i = 0; i < barCount; i++) {
      // Simulate frequency spectrum
      const frequency = i / barCount;
      const lowFreq = Math.exp(-frequency * 3) * 80;
      const midFreq = Math.exp(-Math.abs(frequency - 0.3) * 8) * 60;
      const highFreq = Math.exp(-Math.abs(frequency - 0.8) * 10) * 40;
      const height = Math.max(lowFreq + midFreq + highFreq + Math.random() * 20, 15);
      const isActive = (i / barCount) * 100 <= progress;
      
      bars.push(
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-500 ${
            isActive 
              ? 'bg-gradient-to-t from-cyan-500 via-blue-500 to-purple-500' 
              : isDark ? 'bg-white/15' : 'bg-gray-300'
          } ${isPlaying && isActive ? 'animate-bounce' : ''}`}
          style={{ 
            height: `${height}%`,
            animationDelay: `${i * 40}ms`,
            animationDuration: '0.8s'
          }}
        />
      );
    }
    return bars;
  };

  // ⚡ OPTION 3: Spotify-style Equalizer
  const generateEqualizerBars = (isPlaying: boolean, progress: number) => {
    const bars = [];
    const barCount = 25;
    
    for (let i = 0; i < barCount; i++) {
      const height = 20 + Math.abs(Math.sin(i * 0.3 + (isPlaying ? Date.now() * 0.01 : 0))) * 80;
      const isActive = (i / barCount) * 100 <= progress;
      
      bars.push(
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-200 ${
            isActive 
              ? 'bg-gradient-to-t from-green-500 to-green-400' 
              : isDark ? 'bg-white/20' : 'bg-gray-300'
          } ${isPlaying ? 'animate-pulse' : ''}`}
          style={{ 
            height: `${height}%`,
            animationDelay: `${i * 80}ms`,
            animationDuration: '1.5s'
          }}
        />
      );
    }
    return bars;
  };

  // 🎧 OPTION 4: Minimalist Dots
  const generateDotWaveform = (isPlaying: boolean, progress: number) => {
    const dots = [];
    const dotCount = 30;
    
    for (let i = 0; i < dotCount; i++) {
      const size = 2 + Math.sin(i * 0.2) * 2;
      const isActive = (i / dotCount) * 100 <= progress;
      
      dots.push(
        <div
          key={i}
          className={`rounded-full transition-all duration-400 ${
            isActive 
              ? 'bg-gradient-to-r from-pink-500 to-violet-500' 
              : isDark ? 'bg-white/25' : 'bg-gray-400'
          } ${isPlaying && isActive ? 'animate-ping' : ''}`}
          style={{ 
            width: `${size + 2}px`,
            height: `${size + 2}px`,
            animationDelay: `${i * 100}ms`,
            animationDuration: '2s'
          }}
        />
      );
    }
    return dots;
  };

  // Choose your preferred waveform here! 
  // Change the function name below to try different styles:
  // - generateSoundCloudWaveform (Orange SoundCloud style)
  // - generateFrequencyBars (Colorful frequency spectrum)  
  // - generateEqualizerBars (Green Spotify style)
  // - generateDotWaveform (Minimalist dots)
  const generateWaveform = generateSoundCloudWaveform;

  // Load captions from VTT files
  const loadCaptions = async (postId: string, captionsUrl: string) => {
    if (loadedCaptions[postId]) return; // Already loaded

    try {
      const response = await fetch(captionsUrl);
      const vttText = await response.text();
      const captions = parseVTT(vttText);
      
      setLoadedCaptions(prev => ({
        ...prev,
        [postId]: captions
      }));
    } catch (error) {
      console.warn('Could not load captions:', error);
    }
  };

  const parseVTT = (vttText: string) => {
    const lines = vttText.split(/\r?\n/);
    const captions = [];
    let currentCaption: any = null;
    let captionText = '';
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === 'WEBVTT' || line === '') continue;
      if (line.includes('-->')) {
        if (currentCaption) {
          currentCaption.text = captionText.trim();
          captions.push(currentCaption);
          captionText = '';
        }
        const [start, end] = line.split('-->').map(time => timeToSeconds(time.trim()));
        currentCaption = { start, end, text: '' };
      } else if (currentCaption && line) {
        captionText += line + '\n';
      }
    }
  
    if (currentCaption) {
      currentCaption.text = captionText.trim();
      captions.push(currentCaption);
    }
    return captions;
  };
  
  const timeToSeconds = (timeStr: string) => {
    // Handles "00:00.000" or "00:00:00.000"
    const parts = timeStr.split(':');
    let seconds = 0;
    if (parts.length === 3) {
      seconds += parseInt(parts[0], 10) * 3600;
      seconds += parseInt(parts[1], 10) * 60;
      seconds += parseFloat(parts[2].replace(',', '.'));
    } else if (parts.length === 2) {
      seconds += parseInt(parts[0], 10) * 60;
      seconds += parseFloat(parts[1].replace(',', '.'));
    }
    return seconds;
  };

  // Caption/Subtitle functionality
  const toggleCaptions = (postId: string) => {
    setShowCaptions(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    // Load captions if not already loaded
    const post = predefinedPosts.find(p => p.id === postId);
    if (post?.captionsUrl && !loadedCaptions[postId]) {
      loadCaptions(postId, post.captionsUrl);
    }
  };

  // Get current caption based on time
  const getCaptions = (postId: string, currentTime: number) => {
    const captions = loadedCaptions[postId] || [];
    const currentCaption = captions.find(caption => 
      currentTime >= caption.start && currentTime <= caption.end
    );

    return currentCaption?.text || '';
  };

  const AudioPlayer = ({ post }: { post: MediumPost }) => {
    if (!post.audioUrl) return null;

    const isPlaying = currentlyPlaying === post.id;
    const progress = audioProgress[post.id] || 0;
    const duration = audioDuration[post.id] || 0;
    const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

    return (
      <div className={`mt-3 p-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-lg transition-all duration-300`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleAudioPlay(post.id, post.audioUrl!)}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isPlaying 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-glow' 
                : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-glow'
            } hover:scale-110`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Volume2 size={14} className="text-primary-500" />
                <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  🎧 Podcast Audio
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* CC Toggle Button */}
                <button
                  onClick={() => toggleCaptions(post.id)}
                  className={`p-1 rounded transition-all duration-300 ${
                    showCaptions[post.id]
                      ? 'bg-primary-500 text-white' 
                      : isDark ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title="Toggle Captions"
                >
                  <Subtitles size={12} />
                </button>
                {duration > 0 && (
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-mono`}>
                    {formatTime(progress)} / {formatTime(duration)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Dynamic Waveform Visualizer */}
            <div className={`w-full h-6 ${isDark ? 'bg-white/5' : 'bg-gray-100'} rounded-lg overflow-hidden relative flex items-center justify-center space-x-px px-1`}>
              {generateWaveform(isPlaying, progressPercentage)}
            </div>
          </div>
        </div>

        {/* Captions Display */}
        {showCaptions[post.id] && (
          <div className={`mt-3 p-3 ${isDark ? 'bg-black/30 border-white/10' : 'bg-black/80 border-gray-300'} border rounded-lg transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Subtitles size={14} className="text-white" />
                <span className="text-xs font-medium text-white">Live Captions</span>
                {isPlaying && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleCaptions(post.id)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className={`text-sm leading-relaxed min-h-[3rem] flex items-center ${
              currentCaption[post.id] ? 'text-white' : isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {currentCaption[post.id] || (isPlaying ? 'Listening for speech...' : 'Play audio to see captions')}
            </div>
          </div>
        )}

        {/* Caption Hint - Show when audio is playing but captions are off */}
        {isPlaying && !showCaptions[post.id] && (
          <div className={`mt-2 p-2 ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'} border rounded-lg transition-all duration-300`}>
            <div className="flex items-center space-x-2 text-xs">
              <Subtitles size={12} />
              <span>
                Click the 
                <Subtitles size={10} className="inline mx-1" />
                button to enable live captions
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="blog" ref={sectionRef} className={`py-24 ${isDark ? 'bg-gradient-to-b from-dark-950 to-dark-900' : 'bg-gradient-to-b from-gray-50 to-white'} relative overflow-hidden transition-colors duration-500`}>
      {/* Background Elements */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_40%_20%,rgba(14,165,233,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_40%_20%,rgba(14,165,233,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_60%_80%,rgba(217,70,239,0.05),transparent_50%)]' : 'bg-[radial-gradient(circle_at_60%_80%,rgba(217,70,239,0.02),transparent_50%)]'} transition-opacity duration-500`}></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'} backdrop-blur-sm border rounded-full text-sm mb-6 transition-all duration-300`}>
            <TrendingUp size={16} className="text-primary-500" />
            <span>Latest from Medium</span>
          </div>
          
          <h2 className={`text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
            Latest <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Blog Posts</span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed transition-colors duration-300`}>
            Deep dives into cutting-edge technology, development tutorials, and practical coding solutions from my Medium publication
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} backdrop-blur-sm border rounded-xl overflow-hidden animate-pulse transition-colors duration-300`}>
                <div className={`h-32 ${isDark ? 'bg-white/10' : 'bg-gray-200'} transition-colors duration-300`}></div>
                <div className="p-4 space-y-3">
                  <div className={`h-4 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded w-3/4 transition-colors duration-300`}></div>
                  <div className={`h-3 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded w-full transition-colors duration-300`}></div>
                  <div className={`h-3 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded w-2/3 transition-colors duration-300`}></div>
                  <div className="flex justify-between">
                    <div className={`h-3 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded w-1/4 transition-colors duration-300`}></div>
                    <div className={`h-3 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded w-1/4 transition-colors duration-300`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Posts Grid with Enhanced Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedPosts.map((post, index) => (
              <div
                key={post.id}
                className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ClickableCard
                  url={post.link}
                  title={post.title}
                  description={post.excerpt}
                  image={post.thumbnail}
                  category={post.categories[0]}
                  metadata={{
                    date: formatDate(post.pubDate),
                    readTime: post.readTime
                  }}
                  variant="blog"
                  buttonText="Read on Medium"
                  disableCardClick={true} // Disable card-level clicking for blog posts
                >
                  {/* Audio Player Component */}
                  <AudioPlayer post={post} />
                </ClickableCard>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mb-16">
          <ClickableCard
            url="https://medium.com/@nitinsgavane"
            title="Explore All Articles"
            description="Visit my Medium profile to read all published articles, tutorials, and technical insights."
            category="Medium"
            variant="default"
            buttonText="View All Articles"
            className="max-w-md mx-auto"
          />
        </div>

        {/* Newsletter Signup */}
        <div className={`relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm border rounded-2xl p-8 text-center overflow-hidden transition-all duration-300`}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10"></div>
          <div className="relative z-10">
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
              Stay Updated with Latest <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Insights</span>
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6 max-w-xl mx-auto transition-colors duration-300`}>
              Get weekly updates on development tutorials, coding best practices, and exclusive content delivered directly from Medium.
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
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} mt-4 transition-colors duration-300`}>
              Or follow me directly on{' '}
              <a 
                href="https://medium.com/@nitinsgavane" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Medium
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
