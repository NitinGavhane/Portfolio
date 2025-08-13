import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const LoadingTransition = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.1),transparent_50%)]"></div>
      
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-2xl opacity-75 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent text-6xl font-bold flex items-center justify-center space-x-4">
            <Sparkles className="text-primary-500 animate-spin" size={48} />
            <span>NG</span>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-white text-xl font-medium">
          Crafting Excellence...
        </div>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-2 font-mono">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary-500 rounded-full animate-float opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingTransition;