export interface Project {
  id: number;
  title: string;
  year: string;
  category: string;
  description: string;
  technologies: string[];
  github: string;
  live: string;
  image: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'DailyStory',
    year: '2025',
    category: 'Full-Stack',
    description: 'Capture and preserve your daily experiences in beautiful stories — private or shared with the world.',
    technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    github: 'https://github.com/NitinGavhane/DailyStory.git',
    live: 'https://daily-story.vercel.app/',
    image: 'projects_images/1.png',
  },
  {
    id: 2,
    title: 'MyPortfolio',
    year: '2025',
    category: 'Full-Stack',
    description: 'A modern, interactive portfolio built with React, TypeScript, and Tailwind CSS.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    github: 'https://github.com/NitinGavhane/Portfolio.git',
    live: 'https://nitin-gavhane-dev.vercel.app/',
    image: 'projects_images/2.png',
  },
  {
    id: 3,
    title: 'Termisume',
    year: '2021',
    category: 'Creative Web',
    description: 'A terminal-inspired personal site with a typewriter effect — minimal, fast, and memorable.',
    technologies: ['HTML5', 'CSS3', 'Vanilla JS'],
    github: 'https://github.com/NitinGavhane/nitin.git',
    live: 'https://nitin.vercel.app/',
    image: 'projects_images/3.png',
  },
];
