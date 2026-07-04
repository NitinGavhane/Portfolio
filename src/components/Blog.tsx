import { useState, useRef, useEffect } from 'react';
import { TrendingUp, Play, Pause, Volume2, Subtitles, ExternalLink } from 'lucide-react';
import ClickableCard from './ClickableCard';

interface Caption {
  start: number;
  end: number;
  text: string;
}

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

const predefinedPosts: MediumPost[] = [
  {
    id: '1',
    title: "2025 Guide: Run DeepSeek R1 Locally with Ollama in 10 Minutes — Build Your Own AI Web Recon Tool",
    excerpt: "Learn how to set up DeepSeek R1 locally using Ollama and build a powerful AI-powered web reconnaissance tool for cybersecurity professionals.",
    link: "https://nitingavhane.medium.com/2025-guide-run-deepseek-r1-locally-with-ollama-in-10-minutes-build-your-own-ai-web-recon-tool-0816335bc48d",
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
    link: "https://nitingavhane.medium.com/mongodb-and-node-js-coding-round-questions-you-need-to-know-c13eb2de8b4e",
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
    link: "https://nitingavhane.medium.com/node-js-coding-round-success-must-know-questions-and-solutions-3f7614d3278b",
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
    link: "https://nitingavhane.medium.com/jdbc-crud-operations-in-spring-boot-maven-project-3dd564cf5f31",
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
    link: "https://nitingavhane.medium.com/angular-working-with-json-data-in-different-scenarios-552947e026bc",
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
    link: "https://nitingavhane.medium.com/from-zero-to-firestore-a-hands-on-guide-for-2025-angular-projects-1ecc57b6546b",
    pubDate: "2025-01-03T13:10:00Z",
    categories: ["Development", "Frontend"],
    thumbnail: "/Firebase.png",
    readTime: "20 min read",
    audioUrl: "/prodcast_audio/Zero to Firestore_ Angular Project Guide.wav",
    captionsUrl: "/captions/firebase-angular.vtt"
  }
];

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mediumPosts, setMediumPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<{ [key: string]: number }>({});
  const [audioDuration, setAudioDuration] = useState<{ [key: string]: number }>({});
  const [showCaptions, setShowCaptions] = useState<{ [key: string]: boolean }>({});
  const [currentCaption, setCurrentCaption] = useState<{ [key: string]: string }>({});
  const [loadedCaptions, setLoadedCaptions] = useState<{ [key: string]: Caption[] }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const sectionRef = useRef<HTMLDivElement>(null);

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
              ? 'bg-[var(--text-primary)]'
              : 'bg-[var(--border-secondary)]'
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
    const captions: Caption[] = [];
    let currentCaption: Caption | null = null;
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
      <div className="mt-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleAudioPlay(post.id, post.audioUrl!)}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)] transition-transform duration-300 hover:scale-105"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Volume2 size={14} className="text-[var(--text-tertiary)]" />
                <span className="editorial-label text-[10px]">Podcast Audio</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* CC Toggle */}
                <button
                  onClick={() => toggleCaptions(post.id)}
                  className={`p-1 border transition-colors duration-300 ${
                    showCaptions[post.id]
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                      : 'bg-[var(--bg-primary)] text-[var(--text-tertiary)] border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                  }`}
                  title="Toggle Captions"
                  aria-label="Toggle captions"
                >
                  <Subtitles size={12} />
                </button>
                {duration > 0 && (
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    {formatTime(progress)} / {formatTime(duration)}
                  </span>
                )}
              </div>
            </div>

            {/* Waveform */}
            <div className="w-full h-6 bg-[var(--bg-tertiary)] overflow-hidden relative flex items-center justify-center space-x-px px-1">
              {generateWaveform(isPlaying, progressPercentage)}
            </div>
          </div>
        </div>

        {/* Captions */}
        {showCaptions[post.id] && (
          <div className="mt-3 p-3 bg-[var(--text-primary)] text-[var(--bg-primary)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Subtitles size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Live Captions</span>
                {isPlaying && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleCaptions(post.id)}
                className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Close captions"
              >
                ✕
              </button>
            </div>
            <div className={`text-sm leading-relaxed min-h-[3rem] flex items-center ${
              currentCaption[post.id] ? '' : 'opacity-50'
            }`}>
              {currentCaption[post.id] || (isPlaying ? 'Listening for speech...' : 'Play audio to see captions')}
            </div>
          </div>
        )}

        {/* Caption hint */}
        {isPlaying && !showCaptions[post.id] && (
          <div className="mt-2 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-tertiary)]">
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
    <section
      id="blog"
      ref={sectionRef}
      className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-20 items-start mb-16">
          <div>
            <p className="editorial-label mb-4 flex items-center gap-2">
              <TrendingUp size={13} /> Latest from Medium
            </p>
            <h2 className="editorial-heading text-4xl sm:text-5xl text-[var(--text-primary)]">
              Blog &amp; Writing
            </h2>
          </div>
          <p className="editorial-body self-end max-w-xl">
            Deep dives into cutting-edge technology, development tutorials, and
            practical coding solutions from my Medium publication.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="border border-[var(--border-primary)] overflow-hidden">
                <div className="h-40 loading-skeleton"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 loading-skeleton rounded w-3/4"></div>
                  <div className="h-3 loading-skeleton rounded w-full"></div>
                  <div className="h-3 loading-skeleton rounded w-2/3"></div>
                  <div className="flex justify-between">
                    <div className="h-3 loading-skeleton rounded w-1/4"></div>
                    <div className="h-3 loading-skeleton rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedPosts.map((post, index) => (
              <div
                key={post.id}
                className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
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

        {/* View All */}
        <div className="text-center mb-16">
          <a
            href="https://nitingavhane.medium.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            View All Articles on Medium
            <ExternalLink size={13} className="ml-2" />
          </a>
        </div>

        {/* Newsletter */}
        <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-8 sm:p-12 text-center">
          <p className="editorial-label mb-4">Newsletter</p>
          <h3 className="editorial-heading text-2xl sm:text-3xl text-[var(--text-primary)] mb-4">
            Stay updated with the latest insights
          </h3>
          <p className="editorial-body max-w-xl mx-auto mb-8">
            Weekly updates on development tutorials, coding best practices, and
            exclusive content delivered directly from Medium.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="input-minimal flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-[var(--text-muted)] mt-5">
            Or follow me directly on{' '}
            <a
              href="https://nitingavhane.medium.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link"
            >
              Medium
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Blog;
