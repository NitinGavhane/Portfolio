import { useEffect } from 'react';
import Seo from '../components/Seo';
import { personAndSiteJsonLd } from '../lib/structuredData';
import Profile from '../components/Profile';
import TrustedByProcess from '../components/TrustedByProcess';
import Services from '../components/Services';
import Skills from '../components/Skills';
import Achievements from '../components/Achievements';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import EBooks from '../components/EBooks';
import Contact from '../components/Contact';

const HomePage = () => {
  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    };
    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <>
      <Seo path="/" jsonLd={personAndSiteJsonLd()} />
      <Profile />
      <TrustedByProcess />
      <Services />
      <section id="about">
        <Skills />
      </section>
      <Achievements />
      <Projects />
      <Blog />
      <EBooks />
      <Contact />
    </>
  );
};

export default HomePage;
