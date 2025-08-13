import React from 'react';
import ClickableCard from './ClickableCard';
import { Star, Download, Code, Shield } from 'lucide-react';

const ClickableCardDemo = () => {
  const sampleCards = [
    {
      id: 1,
      title: "2025 Guide: Run DeepSeek R1 Locally with Ollama",
      description: "Learn how to set up DeepSeek R1 locally using Ollama and build a powerful AI-powered web reconnaissance tool for cybersecurity professionals.",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "AI",
      url: "https://medium.com/@nitinsgavane/2025-guide-run-deepseek-r1-locally-with-ollama-in-10-minutes-build-your-own-ai-web-recon-tool-0816335bc48d",
      metadata: {
        date: "Jan 15, 2025",
        readTime: "10 min read",
        author: "Nitin Gavhane"
      },
      variant: "blog" as const
    },
    {
      id: 2,
      title: "SecureAuth Platform",
      description: "Next-generation authentication system with biometric integration and zero-trust architecture for enterprise security.",
      image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Security",
      url: "#",
      metadata: {
        date: "2024",
        readTime: "Live Demo"
      },
      variant: "project" as const,
      buttonText: "View Project"
    },
    {
      id: 3,
      title: "The Complete Guide to Modern Cybersecurity",
      description: "Comprehensive handbook covering advanced threat detection and next-generation security frameworks for professionals.",
      image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Security",
      url: "#",
      metadata: {
        date: "320 pages",
        readTime: "Free Download"
      },
      variant: "ebook" as const,
      buttonText: "Download eBook"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900 p-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Clickable Card Component <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Demo</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Interactive cards with distinct hover effects for both card and button interactions
          </p>
        </div>

        {/* Basic Cards Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Different Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCards.map((card) => (
              <ClickableCard
                key={card.id}
                url={card.url}
                title={card.title}
                description={card.description}
                image={card.image}
                category={card.category}
                metadata={card.metadata}
                variant={card.variant}
                buttonText={card.buttonText}
              />
            ))}
          </div>
        </div>

        {/* Cards with Custom Content */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Cards with Custom Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClickableCard
              url="#"
              title="AI Analytics Dashboard"
              description="Real-time business intelligence platform with predictive analytics and custom visualizations."
              image="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400"
              category="Development"
              variant="project"
              buttonText="View Demo"
            >
              {/* Custom content inside card */}
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star size={14} />
                  <span className="text-sm">4.9</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Code size={14} />
                  <span className="text-sm">React, Python</span>
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <Shield size={14} />
                  <span className="text-sm">Secure</span>
                </div>
              </div>
            </ClickableCard>

            <ClickableCard
              url="#"
              title="Full-Stack Development Mastery"
              description="Advanced patterns for building scalable applications with React, Node.js, and cloud-native architectures."
              image="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400"
              category="Tutorial"
              variant="ebook"
              buttonText="Get eBook"
            >
              {/* Custom pricing and stats */}
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  $29.99
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Download size={12} />
                  <span>12.8k downloads</span>
                </div>
              </div>
            </ClickableCard>
          </div>
        </div>

        {/* Cards without Images */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Text-Only Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ClickableCard
              url="https://medium.com/@nitinsgavane/mongodb-and-node-js-coding-round-questions-you-need-to-know-c13eb2de8b4e"
              title="MongoDB and Node.js Coding Questions"
              description="Essential MongoDB and Node.js interview questions with detailed solutions to help you ace your next coding interview."
              category="Database"
              metadata={{
                date: "Jan 12, 2025",
                readTime: "12 min read"
              }}
              variant="blog"
            />
            
            <ClickableCard
              url="https://medium.com/@nitinsgavane/node-js-coding-round-success-must-know-questions-and-solutions-3f7614d3278b"
              title="Node.js Coding Round Success"
              description="Comprehensive guide to Node.js coding interview questions with practical solutions and best practices."
              category="Backend"
              metadata={{
                date: "Jan 10, 2025",
                readTime: "15 min read"
              }}
              variant="blog"
            />

            <ClickableCard
              url="#"
              title="Quick Reference Guide"
              description="Essential commands and shortcuts for modern development workflows and productivity."
              category="Tutorial"
              metadata={{
                date: "Free",
                readTime: "PDF"
              }}
              variant="default"
              buttonText="Download PDF"
            />
          </div>
        </div>

        {/* Interactive Features Demo */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Interactive Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Card Interactions</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Hover effects on entire card</li>
                <li>• Scale animation on hover</li>
                <li>• Background gradient overlay</li>
                <li>• Image zoom effect</li>
                <li>• Title color transition</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Button Interactions</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Distinct button hover effects</li>
                <li>• Independent scale animation</li>
                <li>• Glow effect on hover</li>
                <li>• Shimmer animation</li>
                <li>• Arrow icon translation</li>
                <li>• Prevents card click when clicked</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickableCardDemo;