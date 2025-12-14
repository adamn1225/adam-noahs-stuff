export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: 'AI' | 'Brand Protection' | 'SaaS' | 'Video Analysis';
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: 'premier-watchdog',
    title: 'Premier Watchdog',
    description: 'Advanced IP brand protection platform with automated eBay monitoring, VeRO reporting, and intelligent alert system. Scans thousands of listings daily to protect trademark rights.',
    image: '/app_portfolio/watchdog-ip-brand-protection.png',
    tags: ['Go', 'Next.js', 'PostgreSQL', 'eBay API', 'Railway'],
    category: 'Brand Protection',
  },
  {
    id: 'premier-watchdog-scanner',
    title: 'Premier Watchdog Scanner',
    description: 'Real-time automated scanner engine with rate limiting and bad actor detection. Monitors eBay listings 24/7 for trademark violations.',
    image: '/app_portfolio/premier_watchdog_scanner.png',
    tags: ['Go', 'Cron Jobs', 'API Integration', 'Railway'],
    category: 'Brand Protection',
  },
  {
    id: 'premier-watchdog-email',
    title: 'Email Editor System',
    description: 'Drag-and-drop email template editor for VeRO takedown notices with dynamic variable support and professional formatting.',
    image: '/app_portfolio/premier-watchdog-email-editor.png',
    tags: ['React', 'Email Templates', 'WYSIWYG'],
    category: 'Brand Protection',
  },
  {
    id: 'simtrain-dashboard',
    title: 'SimTrain Sales Dashboard',
    description: 'Comprehensive sales training platform dashboard with real-time analytics, progress tracking, and performance metrics for sales teams.',
    image: '/app_portfolio/simtrain-sales-training-dashboard.png',
    tags: ['React', 'TypeScript', 'Analytics', 'Dashboard'],
    category: 'SaaS',
  },
  {
    id: 'simtrain-user-dash',
    title: 'SimTrain User Portal',
    description: 'Interactive user dashboard for sales representatives to track their training progress, view challenges, and improve their skills.',
    image: '/app_portfolio/simtrain-sales-training-user-dashh.png',
    tags: ['Next.js', 'TypeScript', 'User Analytics'],
    category: 'SaaS',
  },
  {
    id: 'simtrain-ai-call',
    title: 'AI-Powered Customer Simulator',
    description: 'Advanced AI customer simulation for realistic sales training scenarios. Uses natural language processing for dynamic conversations.',
    image: '/app_portfolio/simtrain-ai-customer-call.png',
    tags: ['AI/ML', 'OpenAI', 'Real-time Audio', 'NLP'],
    category: 'AI',
  },
  {
    id: 'screensense',
    title: 'ScreenSense Video Analyzer',
    description: 'AI-powered video analysis tool that extracts insights, generates transcripts, and provides intelligent summaries of video content.',
    image: '/app_portfolio/screensense-video-analyzer.png',
    tags: ['AI/ML', 'Video Processing', 'Computer Vision', 'NLP'],
    category: 'Video Analysis',
  },
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot Interface',
    description: 'Modern conversational AI interface with streaming responses, context awareness, and beautiful UX design.',
    image: '/app_portfolio/ai-chat-bot.png',
    tags: ['React', 'AI/ML', 'WebSockets', 'OpenAI'],
    category: 'AI',
  },
];

export const skills = [
  'React & Next.js',
  'TypeScript',
  'Go (Golang)',
  'PostgreSQL',
  'AI/ML Integration',
  'REST APIs',
  'Cloud Deployment',
  'Tailwind CSS',
  'Real-time Systems',
  'Video Processing',
  'Brand Protection',
  'SaaS Development',
];

export const categories = ['All', 'AI', 'Brand Protection', 'SaaS', 'Video Analysis'] as const;
