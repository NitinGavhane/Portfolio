import { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';
import LoadingTransition from './components/LoadingTransition';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import Projects from './components/Projects';
import Blog from './components/Blog';
import EBooks from './components/EBooks';
import Contact from './components/Contact';
import Footer from './components/Footer';

function AppContent() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <div className="theme-bg-primary theme-text-primary min-h-screen font-display relative overflow-x-hidden theme-transition">
      <LoadingTransition />
      <CustomCursor />
      <ParticleBackground />
      <Header />
      <main className="relative z-10">
        <Hero />
        <section id="about">
          <Skills />
        </section>
        <Achievements />
        <Projects />
        <Blog />
        <EBooks />
        <Contact />
      </main>
      <Footer />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            iconTheme: {
              primary: '#0ea5e9',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;