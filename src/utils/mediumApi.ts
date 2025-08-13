// Medium RSS Feed Integration Utilities

export interface MediumPost {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  pubDate: string;
  categories: string[];
  thumbnail?: string;
  readTime?: string;
  author?: string;
}

export interface MediumFeedResponse {
  status: string;
  feed: {
    title: string;
    description: string;
    link: string;
    image: string;
  };
  items: Array<{
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    content: string;
    categories: string[];
  }>;
}

/**
 * Fetches Medium posts from RSS feed using RSS2JSON service
 * @param username - Medium username (e.g., 'nitinsgavane')
 * @param count - Number of posts to fetch (default: 10)
 * @returns Promise<MediumPost[]>
 */
export const fetchMediumPosts = async (
  username: string, 
  count: number = 10
): Promise<MediumPost[]> => {
  try {
    // Using RSS2JSON service as a CORS proxy for Medium RSS
    const rssUrl = `https://medium.com/feed/@${username}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=${count}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: MediumFeedResponse = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('RSS feed parsing failed');
    }
    
    return data.items.map((item, index) => ({
      id: item.guid || `post-${index}`,
      title: cleanTitle(item.title),
      excerpt: extractExcerpt(item.description || item.content),
      link: item.link,
      pubDate: item.pubDate,
      categories: item.categories || extractCategoriesFromContent(item.title + ' ' + item.description),
      thumbnail: item.thumbnail || generateThumbnailFromTitle(item.title),
      readTime: estimateReadTime(item.content || item.description),
      author: item.author || username
    }));
    
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    throw error;
  }
};

/**
 * Alternative method using direct RSS parsing (requires CORS proxy)
 */
export const fetchMediumPostsDirect = async (username: string): Promise<MediumPost[]> => {
  try {
    // Using a CORS proxy service
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const rssUrl = `https://medium.com/feed/@${username}`;
    
    const response = await fetch(proxyUrl + rssUrl);
    const xmlText = await response.text();
    
    // Parse XML (you'd need to implement XML parsing or use a library)
    return parseRSSXML(xmlText);
    
  } catch (error) {
    console.error('Error fetching Medium posts directly:', error);
    throw error;
  }
};

/**
 * Clean and format the post title
 */
const cleanTitle = (title: string): string => {
  return title.replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'");
};

/**
 * Extract clean excerpt from HTML content
 */
const extractExcerpt = (htmlContent: string, maxLength: number = 150): string => {
  // Remove HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace
  const cleanText = textContent.replace(/\s+/g, ' ').trim();
  
  // Truncate to desired length
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  return cleanText.substring(0, maxLength).trim() + '...';
};

/**
 * Estimate reading time based on content length
 */
const estimateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `${minutes} min read`;
};

/**
 * Extract categories from content using keyword matching
 */
const extractCategoriesFromContent = (content: string): string[] => {
  const categories: string[] = [];
  const lowerContent = content.toLowerCase();
  
  const categoryKeywords = {
    'Cybersecurity': ['security', 'cyber', 'threat', 'vulnerability', 'encryption', 'authentication'],
    'Development': ['development', 'coding', 'programming', 'software', 'web', 'app'],
    'AI': ['ai', 'artificial intelligence', 'machine learning', 'neural', 'deep learning'],
    'Cloud': ['cloud', 'aws', 'azure', 'gcp', 'serverless', 'kubernetes'],
    'Blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'smart contract', 'defi'],
    'DevOps': ['devops', 'ci/cd', 'docker', 'deployment', 'automation', 'infrastructure']
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      categories.push(category);
    }
  }
  
  return categories.length > 0 ? categories : ['Technology'];
};

/**
 * Generate appropriate thumbnail based on title content
 */
const generateThumbnailFromTitle = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('security') || lowerTitle.includes('cyber')) {
    return 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400';
  } else if (lowerTitle.includes('ai') || lowerTitle.includes('machine')) {
    return 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400';
  } else if (lowerTitle.includes('cloud') || lowerTitle.includes('aws')) {
    return 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400';
  } else if (lowerTitle.includes('blockchain') || lowerTitle.includes('crypto')) {
    return 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400';
  } else if (lowerTitle.includes('development') || lowerTitle.includes('code')) {
    return 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // Default tech thumbnail
  return 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400';
};

/**
 * Parse RSS XML content (basic implementation)
 */
const parseRSSXML = (xmlText: string): MediumPost[] => {
  // This is a simplified parser - in production, use a proper XML parsing library
  const posts: MediumPost[] = [];
  
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    
    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const guid = item.querySelector('guid')?.textContent || `post-${index}`;
      
      posts.push({
        id: guid,
        title: cleanTitle(title),
        excerpt: extractExcerpt(description),
        link,
        pubDate,
        categories: extractCategoriesFromContent(title + ' ' + description),
        thumbnail: generateThumbnailFromTitle(title),
        readTime: estimateReadTime(description)
      });
    });
    
  } catch (error) {
    console.error('Error parsing RSS XML:', error);
  }
  
  return posts;
};

/**
 * Format date for display
 */
export const formatPostDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return 'Recent';
  }
};

/**
 * Get category-specific styling
 */
export const getCategoryGradient = (category: string): string => {
  const gradients: { [key: string]: string } = {
    'Cybersecurity': 'from-red-500 to-pink-500',
    'Development': 'from-blue-500 to-cyan-500',
    'AI': 'from-purple-500 to-violet-500',
    'Cloud': 'from-green-500 to-emerald-500',
    'Blockchain': 'from-indigo-500 to-purple-500',
    'DevOps': 'from-yellow-500 to-orange-500',
    'Technology': 'from-gray-500 to-gray-600'
  };
  
  return gradients[category] || gradients['Technology'];
};