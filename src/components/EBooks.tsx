import { useState, useRef, useEffect } from 'react';
import { Download, BookOpen, Star, Users, ArrowRight } from 'lucide-react';

const ebooks = [
  {
    id: 1,
    title: "The Angular Developer’s Handbook",
    description: "Your all-in-one guide to Angular — from fundamental concepts to advanced techniques. Hands-on examples, best practices, and real-world scenarios to help you master Angular efficiently, whether you're a beginner or a seasoned developer.",
    cover: "https://m.media-amazon.com/images/I/61qdFLcJLXL._SY385_.jpg",
    pages: 104,
    downloads: 3,
    rating: 4.9,
    price: "260₹",
    downloadLink: "https://www.amazon.in/Angular-Developers-Handbook-Freelance-Practices-ebook/dp/B0F1M4FRQ9",
    featured: true,
    bestseller: true,
  },
  {
    id: 2,
    title: "The Complete Vegan Fat-Loss Kitchen Guide",
    description: "Lose fat eating delicious vegan food using ingredients already in your kitchen — no expensive supplements, no complicated recipes. 30 days of high-protein, plant-based recipes with full macros, meal-prep strategies, budget shopping lists, and science-backed nutrition.",
    cover: "https://public-files.gumroad.com/ynn5a513wbx7xkoingmnhqqh0r0e",
    pages: 22,
    downloads: 0,
    rating: null,
    price: "$14.99",
    downloadLink: "https://nitingavhane.gumroad.com/l/jpixs",
    featured: false,
    bestseller: false,
  },
  {
    id: 3,
    title: "Solo Female Travel Safety Guide",
    description: "A practical guide to help women travel solo with greater confidence, awareness, and peace of mind — covering pre-trip planning, accommodation and transport safety, scam prevention, digital privacy, emergency protocols, and mindset tips for every stage of the journey.",
    cover: "https://public-files.gumroad.com/vaj4pbgyishldl8m7m1wtb9m8pgv",
    pages: 23,
    downloads: 0,
    rating: null,
    price: "$12",
    downloadLink: "https://nitingavhane.gumroad.com/l/cqlchl",
    featured: false,
    bestseller: false,
  },
];

const EBooks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const displayedBooks = ebooks.slice(0, 6);

  return (
    <section
      id="ebooks"
      ref={sectionRef}
      className="bg-[var(--bg-primary)] border-t border-[var(--border-primary)]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-20 items-start mb-16">
          <div>
            <p className="editorial-label mb-4">Digital Publications</p>
            <h2 className="editorial-heading text-4xl sm:text-5xl text-[var(--text-primary)]">
              Published eBooks
            </h2>
          </div>
          <p className="editorial-body self-end max-w-xl">
            Comprehensive guides and handbooks on modern development and
            cutting-edge security practices — written from real-world delivery.
          </p>
        </div>

        {/* eBooks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-primary)] border border-[var(--border-primary)] mb-16">
          {displayedBooks.map((book, index) => (
            <div
              key={book.id}
              className={`group bg-[var(--bg-primary)] flex flex-col ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Cover */}
              <div className="relative h-64 overflow-hidden flex justify-center items-center bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-auto object-contain group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
                {book.bestseller && (
                  <span className="absolute top-3 left-3 editorial-label text-[10px] px-2 py-1 bg-[var(--text-primary)] text-[var(--bg-primary)]">
                    Bestseller
                  </span>
                )}
                {book.rating != null && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)]">
                    <Star size={10} className="fill-current" />
                    {book.rating}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-serif text-xl text-[var(--text-primary)] mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-4 line-clamp-3">
                  {book.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-5">
                  <span className="flex items-center gap-1">
                    <BookOpen size={11} />
                    {book.pages} pages
                  </span>
                  {book.downloads > 0 && (
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {(book.downloads / 1000).toFixed(1)}k readers
                    </span>
                  )}
                </div>

                {/* Price + CTA */}
                <div className="mt-auto flex items-center justify-between gap-4">
                  <span className="editorial-heading text-2xl text-[var(--text-primary)]">
                    {book.price}
                  </span>
                  <button
                    onClick={() => window.open(book.downloadLink, '_blank', 'noopener,noreferrer')}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    <Download size={12} className="mr-1.5" />
                    {book.price === 'Free' ? 'Download' : 'Purchase'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        {ebooks.length > 6 && (
          <div className="text-center mb-16">
            <button className="btn-outline">
              View All eBooks ({ebooks.length})
              <ArrowRight size={14} className="ml-2" />
            </button>
          </div>
        )}

        {/* Newsletter */}
        <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8 sm:p-12 text-center">
          <p className="editorial-label mb-4">Stay in the loop</p>
          <h3 className="editorial-heading text-2xl sm:text-3xl text-[var(--text-primary)] mb-4">
            Get notified of new releases
          </h3>
          <p className="editorial-body max-w-xl mx-auto mb-8">
            Be the first to access new eBooks, exclusive content, and special
            discounts on premium publications.
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
        </div>
      </div>
    </section>
  );
};

export default EBooks;
