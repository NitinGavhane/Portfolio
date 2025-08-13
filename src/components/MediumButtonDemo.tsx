import React from 'react';
import MediumButton from './MediumButton';

const MediumButtonDemo = () => {
  // Your specific Medium article URLs
  const mediumArticles = [
    {
      title: "DeepSeek R1 Guide",
      url: "https://medium.com/@nitinsgavane/2025-guide-run-deepseek-r1-locally-with-ollama-in-10-minutes-build-your-own-ai-web-recon-tool-0816335bc48d"
    },
    {
      title: "MongoDB Node.js",
      url: "https://medium.com/@nitinsgavane/mongodb-and-node-js-coding-round-questions-you-need-to-know-c13eb2de8b4e"
    },
    {
      title: "Node.js Coding Round",
      url: "https://medium.com/@nitinsgavane/node-js-coding-round-success-must-know-questions-and-solutions-3f7614d3278b"
    },
    {
      title: "JDBC CRUD Operations",
      url: "https://medium.com/@nitinsgavane/jdbc-crud-operations-in-spring-boot-maven-project-3dd564cf5f31"
    },
    {
      title: "Angular JSON Data",
      url: "https://medium.com/@nitinsgavane/angular-working-with-json-data-in-different-scenarios-552947e026bc"
    },
    {
      title: "Firestore Angular Guide",
      url: "https://medium.com/@nitinsgavane/from-zero-to-firestore-a-hands-on-guide-for-2025-angular-projects-1ecc57b6546b"
    }
  ];

  return (
    <div className="p-8 bg-dark-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Medium Button Component Demo
        </h1>
        
        {/* Button Variants */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Button Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-white mb-3">Primary</h3>
              <MediumButton 
                url={mediumArticles[0].url}
                variant="primary"
              />
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-white mb-3">Secondary</h3>
              <MediumButton 
                url={mediumArticles[0].url}
                variant="secondary"
              />
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-white mb-3">Outline</h3>
              <MediumButton 
                url={mediumArticles[0].url}
                variant="outline"
              />
            </div>
          </div>
        </div>

        {/* Button Sizes */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Button Sizes</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <MediumButton 
              url={mediumArticles[0].url}
              size="sm"
            />
            <MediumButton 
              url={mediumArticles[0].url}
              size="md"
            />
            <MediumButton 
              url={mediumArticles[0].url}
              size="lg"
            />
          </div>
        </div>

        {/* Your Articles */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Your Medium Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediumArticles.map((article, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white mb-3 font-medium">{article.title}</h3>
                <MediumButton 
                  url={article.url}
                  variant="primary"
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Error Handling Demo */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Error Handling</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-white mb-3">Invalid URL</h3>
              <MediumButton 
                url="https://invalid-url.com/article"
                variant="primary"
              />
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-white mb-3">Empty URL</h3>
              <MediumButton 
                url=""
                variant="primary"
              />
            </div>
          </div>
        </div>

        {/* Custom Content */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Custom Content</h2>
          <div className="flex flex-wrap gap-4">
            <MediumButton 
              url={mediumArticles[0].url}
              variant="primary"
            >
              📖 Read Full Article
            </MediumButton>
            <MediumButton 
              url={mediumArticles[1].url}
              variant="secondary"
            >
              🚀 Check it out
            </MediumButton>
            <MediumButton 
              url={mediumArticles[2].url}
              variant="outline"
            >
              Learn More →
            </MediumButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediumButtonDemo;