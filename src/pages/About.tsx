import LegalPage from '../components/LegalPage';
import { siteConfig } from '../lib/siteConfig';

const About = () => (
  <LegalPage
    title="About"
    description="About Nitin Gavhane — Full-Stack Developer and Tech Consultant specialising in secure web applications, QA auditing, and technical writing."
    path="/about"
    updated="July 4, 2026"
  >
    <p>
      Hi, I’m {siteConfig.name} — a {siteConfig.jobTitle} based in {siteConfig.author.location}. I
      help growing businesses design, build, and secure web applications, and I write about the
      craft of modern software development.
    </p>

    <h2>What I Do</h2>
    <p>
      I work across the full stack, from product architecture to production hardening. My focus areas
      are:
    </p>
    <ul>
      <li>
        <strong>Web application development</strong> — building fast, accessible, maintainable
        products with React, TypeScript, and modern back-end tooling.
      </li>
      <li>
        <strong>QA &amp; security auditing</strong> — reviewing applications for correctness,
        performance, and common security weaknesses before they reach users.
      </li>
      <li>
        <strong>Technical writing</strong> — turning complex engineering topics into clear,
        practical articles and documentation.
      </li>
      <li>
        <strong>Technology advisory</strong> — helping teams make sound architecture and tooling
        decisions.
      </li>
    </ul>

    <h2>About This Blog</h2>
    <p>
      The blog is where I share what I learn — hands-on guides on web development, application
      security, AI tooling, and technology strategy. Every article is written from real project
      experience, with the goal of being genuinely useful to other developers and technical
      founders.
    </p>

    <h2>Get in Touch</h2>
    <p>
      Interested in working together, or have feedback on an article? You can reach me at{' '}
      <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>, or connect on{' '}
      <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      ,{' '}
      <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      , and{' '}
      <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer">
        X
      </a>
      .
    </p>
  </LegalPage>
);

export default About;
