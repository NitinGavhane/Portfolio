export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
  detail: string;
}

export const services: Service[] = [
  {
    id: 'gen-ai-consulting',
    number: '01',
    title: 'Gen AI Tool Consulting',
    icon: '◈',
    description:
      'Strategic guidance on integrating generative AI tools into your business operations — from workflow automation to content generation and customer experience enhancement.',
    deliverables: ['AI tool evaluation & selection', 'Use case identification', 'Integration strategy', 'Prompt engineering', 'ROI measurement'],
    detail:
      'I help organisations identify practical AI use cases, evaluate tools, and implement solutions that drive measurable business growth. From LLM integration to automated content pipelines, we build AI strategies that deliver real results.',
  },
  {
    id: 'web-development',
    number: '02',
    title: 'Web App Development',
    icon: '⬡',
    description:
      'End-to-end development of secure, scalable web applications using modern frameworks and best practices — from concept to deployment and beyond.',
    deliverables: ['React, Next.js & Node.js', 'Custom business logic', 'Mobile-first & responsive', 'API design & integration', 'Ongoing support'],
    detail:
      'We design and build high-performance web applications tailored to your business — from SaaS platforms and workflow automation to customer-facing products. Every project follows security-first practices and performance optimisation from day one.',
  },
  {
    id: 'qa-security-auditing',
    number: '03',
    title: 'QA & Security Auditing',
    icon: '◎',
    description:
      'Comprehensive quality assurance and security auditing backed by 1000+ vulnerabilities disclosed to Fortune 500 companies through Bugcrowd.',
    deliverables: ['Penetration testing', 'Vulnerability assessment', 'Functional & regression testing', 'Security code review', 'Incident response planning'],
    detail:
      'With a proven track record of Hall of Fame recognition from Dell, Mastercard, and others, our security auditing ensures your application is robust and audit-ready. We identify vulnerabilities before attackers do.',
  },
  {
    id: 'technical-writing',
    number: '04',
    title: 'Technical Writing',
    icon: '◉',
    description:
      'Clear, comprehensive technical documentation and content that makes complex concepts accessible to your target audience.',
    deliverables: ['API & SDK documentation', 'Developer tutorials & guides', 'E-books & long-form content', 'SEO-optimised tech blogs', 'Content strategy'],
    detail:
      'We translate complex technical concepts into clear documentation, developer guides, and thought-leadership articles. Published author of the Angular Developer\'s Handbook with expertise in API docs, tutorials, and technical content strategy.',
  },
  {
    id: 'strategic-advisory',
    number: '05',
    title: 'Strategic Tech Advisory',
    icon: '◈',
    description:
      'Architecture reviews, vendor selection, engineering roadmaps, and delivery risk management for growing businesses.',
    deliverables: ['Tech stack evaluation', 'Engineering roadmap', 'Team scaling advice', 'Architecture review', 'Free discovery call'],
    detail:
      'Not sure which technology方向 to take? I help growing businesses make informed technology decisions — from architecture reviews and vendor selection to engineering roadmaps and delivery risk management. Start with a free 30-minute discovery call.',
  },
];
