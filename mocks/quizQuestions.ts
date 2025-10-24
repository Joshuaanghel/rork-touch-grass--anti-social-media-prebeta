import { QuizQuestion } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'How do you prefer to spend your free time?',
    options: [
      'Exploring new places and trying new things',
      'Meeting up with friends and socializing',
      'Working on creative projects',
      'Reading, learning, or deep thinking',
    ],
    category: 'lifestyle',
  },
  {
    id: '2',
    question: 'What energizes you most?',
    options: [
      'Adventure and spontaneity',
      'Meaningful conversations',
      'Creating something new',
      'Solving complex problems',
    ],
    category: 'values',
  },
  {
    id: '3',
    question: 'In a group setting, you typically:',
    options: [
      'Take the lead and organize activities',
      'Make sure everyone feels included',
      'Share ideas and inspire others',
      'Listen carefully and contribute thoughtfully',
    ],
    category: 'social',
  },
  {
    id: '4',
    question: 'Your ideal weekend involves:',
    options: [
      'Hiking, traveling, or outdoor activities',
      'Hosting or attending social gatherings',
      'Art, music, or DIY projects',
      'Museums, documentaries, or quiet reflection',
    ],
    category: 'interests',
  },
  {
    id: '5',
    question: 'What matters most to you in friendships?',
    options: [
      'Shared adventures and experiences',
      'Emotional support and connection',
      'Inspiration and creativity',
      'Intellectual stimulation',
    ],
    category: 'values',
  },
  {
    id: '6',
    question: 'When facing a challenge, you:',
    options: [
      'Jump in and figure it out as you go',
      'Reach out to others for support',
      'Think outside the box for solutions',
      'Analyze all options carefully',
    ],
    category: 'lifestyle',
  },
  {
    id: '7',
    question: 'Your favorite type of conversation is:',
    options: [
      'Sharing stories about experiences',
      'Discussing feelings and relationships',
      'Brainstorming ideas and possibilities',
      'Debating concepts and theories',
    ],
    category: 'social',
  },
  {
    id: '8',
    question: 'What describes your approach to life?',
    options: [
      'Seize the day and embrace the unknown',
      'Build strong relationships and community',
      'Express yourself and leave your mark',
      'Understand the world deeply',
    ],
    category: 'values',
  },
];

export const personalityResults = {
  'The Explorer': {
    description: 'You thrive on adventure and new experiences. Always seeking the next thrill, you inspire others to step outside their comfort zones.',
    traits: ['Adventurous', 'Spontaneous', 'Energetic', 'Bold'],
  },
  'The Connector': {
    description: 'You bring people together naturally. Your empathy and social skills create strong, lasting bonds in every community you join.',
    traits: ['Empathetic', 'Social', 'Supportive', 'Warm'],
  },
  'The Creator': {
    description: 'You see the world through a creative lens. Your imagination and artistic vision inspire others to think differently.',
    traits: ['Creative', 'Imaginative', 'Expressive', 'Innovative'],
  },
  'The Thinker': {
    description: 'You dive deep into ideas and concepts. Your analytical mind and curiosity drive you to understand the world at a profound level.',
    traits: ['Analytical', 'Curious', 'Thoughtful', 'Wise'],
  },
  'The Adventurer': {
    description: 'You live for excitement and physical challenges. Your courage and enthusiasm for life motivate others to push their limits.',
    traits: ['Courageous', 'Active', 'Enthusiastic', 'Daring'],
  },
  'The Nurturer': {
    description: 'You care deeply about others\' wellbeing. Your kindness and compassion create safe spaces where people can truly be themselves.',
    traits: ['Caring', 'Patient', 'Reliable', 'Compassionate'],
  },
};
