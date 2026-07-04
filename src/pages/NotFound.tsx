import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';

const NotFound = () => (
  <section className="bg-[var(--bg-primary)] min-h-screen flex items-center">
    <Seo title="Page not found" path="/404" noindex />
    <div className="max-w-lg mx-auto px-6 sm:px-8 py-24 text-center">
      <p className="editorial-label mb-4">Error 404</p>
      <h1 className="font-serif text-5xl sm:text-6xl text-[var(--text-primary)] mb-4">
        Page not found
      </h1>
      <p className="text-[var(--text-tertiary)] mb-10 leading-relaxed">
        The page you’re looking for doesn’t exist or has moved. Let’s get you back on track.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn-primary">
          <ArrowLeft size={15} className="mr-2" /> Back home
        </Link>
        <Link to="/blog" className="btn-outline">
          Read the blog
        </Link>
      </div>
    </div>
  </section>
);

export default NotFound;
