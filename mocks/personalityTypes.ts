export interface PersonalityTypeDetails {
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  inRelationships: string;
  idealActivities: string[];
  growthAreas: string[];
  famousPeople: string[];
  color: string;
  gradient: [string, string];
}

export const personalityTypes: Record<string, PersonalityTypeDetails> = {
  'The Explorer': {
    name: 'The Explorer',
    tagline: 'Adventure is calling, and you must go',
    description: 'Explorers are driven by an insatiable curiosity and a deep need to experience the world firsthand. You thrive on adventure, spontaneity, and the thrill of the unknown. Every day is an opportunity for a new discovery, and you inspire others to break free from routine and embrace the extraordinary.',
    strengths: [
      'Fearless in facing new challenges',
      'Adaptable to changing circumstances',
      'Natural ability to inspire others',
      'High energy and enthusiasm',
      'Quick decision-making skills',
      'Open-minded and accepting of differences'
    ],
    inRelationships: 'You bring excitement and spontaneity to every relationship. Friends value your ability to turn ordinary moments into adventures. You encourage others to take risks and live authentically. While you may struggle with routine, your genuine enthusiasm for life creates memorable connections.',
    idealActivities: [
      'Traveling to new destinations',
      'Outdoor adventures like hiking or rock climbing',
      'Trying exotic foods and cuisines',
      'Extreme sports and physical challenges',
      'Exploring hidden local gems',
      'Spontaneous road trips'
    ],
    growthAreas: [
      'Developing patience with routine',
      'Following through on long-term commitments',
      'Being present in quiet moments',
      'Considering consequences before acting'
    ],
    famousPeople: ['Bear Grylls', 'Anthony Bourdain', 'Amelia Earhart'],
    color: '#F59E0B',
    gradient: ['#F59E0B', '#EF4444'],
  },
  'The Connector': {
    name: 'The Connector',
    tagline: 'Building bridges, one heart at a time',
    description: 'Connectors possess an extraordinary emotional intelligence that allows them to understand and unite people. You have a natural gift for making everyone feel valued and heard. Your warmth and empathy create spaces where authentic relationships flourish, and communities thrive.',
    strengths: [
      'Exceptional emotional intelligence',
      'Natural mediator in conflicts',
      'Creates inclusive environments',
      'Remembers important details about people',
      'Builds lasting, meaningful relationships',
      'Intuitively understands others\' needs'
    ],
    inRelationships: 'You are the glue that holds groups together. Your friends know they can always count on you for support and understanding. You excel at creating deep, authentic connections and have a gift for bringing out the best in others. Your presence makes people feel safe to be themselves.',
    idealActivities: [
      'Hosting intimate gatherings',
      'Volunteering for community causes',
      'Deep one-on-one conversations',
      'Group activities that build bonds',
      'Mentoring and coaching others',
      'Organizing social events'
    ],
    growthAreas: [
      'Setting healthy boundaries',
      'Making time for self-care',
      'Accepting that you can\'t help everyone',
      'Being okay with conflict when necessary'
    ],
    famousPeople: ['Oprah Winfrey', 'Mr. Rogers', 'Brené Brown'],
    color: '#EC4899',
    gradient: ['#EC4899', '#DB2777'],
  },
  'The Creator': {
    name: 'The Creator',
    tagline: 'Turning imagination into reality',
    description: 'Creators see infinite possibilities where others see limitations. Your imagination and artistic vision transform the ordinary into the extraordinary. You express yourself through various mediums, inspiring others to think differently and appreciate beauty in unexpected places.',
    strengths: [
      'Innovative problem-solving',
      'Unique perspective on life',
      'Ability to inspire through art',
      'Comfortable with ambiguity',
      'Natural self-expression',
      'Visionary thinking'
    ],
    inRelationships: 'You bring color and creativity to every interaction. Friends appreciate your ability to see beauty in everything and your passion for self-expression. You encourage others to embrace their authentic selves and think outside conventional boundaries. Your creativity sparks imagination in those around you.',
    idealActivities: [
      'Painting, drawing, or sculpting',
      'Music creation or performance',
      'Writing stories or poetry',
      'Photography and visual arts',
      'DIY projects and crafts',
      'Visiting art galleries and exhibitions'
    ],
    growthAreas: [
      'Balancing creativity with practical needs',
      'Finishing projects you start',
      'Handling criticism constructively',
      'Managing perfectionist tendencies'
    ],
    famousPeople: ['Frida Kahlo', 'David Bowie', 'Maya Angelou'],
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
  },
  'The Thinker': {
    name: 'The Thinker',
    tagline: 'Understanding the world, one idea at a time',
    description: 'Thinkers possess a profound intellectual curiosity and analytical mind. You approach life as a puzzle to be understood, diving deep into concepts and ideas. Your quest for knowledge and truth drives you to explore the fundamental questions of existence, and your insights often illuminate paths for others.',
    strengths: [
      'Exceptional analytical abilities',
      'Deep focus and concentration',
      'Logical problem-solving',
      'Love of learning and growth',
      'Ability to see patterns others miss',
      'Thoughtful and deliberate decision-making'
    ],
    inRelationships: 'You offer wisdom and thoughtful perspective to your relationships. Friends value your ability to listen deeply and provide insightful advice. You create meaningful connections through intellectual exchange and shared curiosity. While you may prefer quality over quantity in friendships, those close to you know your loyalty runs deep.',
    idealActivities: [
      'Reading philosophy or science',
      'Engaging in deep conversations',
      'Solving complex puzzles',
      'Attending lectures and learning events',
      'Research and independent study',
      'Contemplative practices like meditation'
    ],
    growthAreas: [
      'Balancing thinking with feeling',
      'Taking action despite uncertainty',
      'Expressing emotions openly',
      'Accepting that not everything has an answer'
    ],
    famousPeople: ['Carl Sagan', 'Marie Curie', 'Stephen Hawking'],
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0891B2'],
  },
  'The Adventurer': {
    name: 'The Adventurer',
    tagline: 'Life is either a daring adventure or nothing at all',
    description: 'Adventurers are driven by a need for excitement, challenge, and physical expression. You live boldly, pushing boundaries and inspiring others to test their limits. Your courage and enthusiasm for life motivate everyone around you to embrace their own potential for greatness.',
    strengths: [
      'Incredible physical energy',
      'Courageous in face of fear',
      'Natural leadership in action',
      'Resilient and quick to recover',
      'Motivates others through example',
      'Lives fully in the present moment'
    ],
    inRelationships: 'You inspire your friends to push past their comfort zones and discover what they\'re capable of. Your enthusiasm is contagious, and people are drawn to your confident, can-do attitude. You create bonds through shared challenges and celebrate victories together. Your friends know life is never boring with you around.',
    idealActivities: [
      'Competitive sports and athletics',
      'Mountaineering and extreme activities',
      'Training for marathons or competitions',
      'Martial arts and combat sports',
      'Adventure racing and obstacle courses',
      'Any physical challenge that tests limits'
    ],
    growthAreas: [
      'Recognizing when to rest',
      'Accepting limitations gracefully',
      'Appreciating stillness and reflection',
      'Balancing risk with responsibility'
    ],
    famousPeople: ['Alex Honnold', 'Serena Williams', 'Ernest Shackleton'],
    color: '#10B981',
    gradient: ['#10B981', '#059669'],
  },
  'The Nurturer': {
    name: 'The Nurturer',
    tagline: 'Creating safe spaces where souls can flourish',
    description: 'Nurturers possess a deep well of compassion and patience. You have an innate ability to make others feel safe, valued, and supported. Your caring nature creates environments where people can heal, grow, and become their best selves. You find fulfillment in helping others thrive.',
    strengths: [
      'Exceptional patience and understanding',
      'Creates safe, judgement-free spaces',
      'Natural caregiver and supporter',
      'Highly reliable and trustworthy',
      'Attentive to others\' needs',
      'Calming presence in crisis'
    ],
    inRelationships: 'You are the person everyone turns to in times of need. Friends treasure your unwavering support and your ability to offer comfort without judgement. You remember the small details that matter and show up consistently. Your nurturing nature helps others feel truly seen and cared for.',
    idealActivities: [
      'Caring for others (people, animals, plants)',
      'Cooking meals for loved ones',
      'Creating comfortable home spaces',
      'Volunteering at shelters or hospitals',
      'Gardening and nurturing growth',
      'Listening and providing emotional support'
    ],
    growthAreas: [
      'Prioritizing your own needs',
      'Asking for help when needed',
      'Setting boundaries without guilt',
      'Recognizing your own worth beyond giving'
    ],
    famousPeople: ['Jane Goodall', 'Mother Teresa', 'Bob Ross'],
    color: '#A855F7',
    gradient: ['#A855F7', '#9333EA'],
  },
  'The Visionary': {
    name: 'The Visionary',
    tagline: 'Seeing possibilities beyond the horizon',
    description: 'Visionaries possess the rare ability to see potential futures and inspire others toward them. You think in systems and patterns, connecting disparate ideas into innovative solutions. Your forward-thinking approach and ability to articulate compelling visions make you a natural leader and change-maker.',
    strengths: [
      'Strategic long-term thinking',
      'Innovative solution generation',
      'Natural ability to inspire others',
      'Comfortable with complexity',
      'Sees opportunities others miss',
      'Connects ideas across domains'
    ],
    inRelationships: 'You challenge your friends to think bigger and reach higher. Your conversations often open new perspectives and possibilities. While you may sometimes seem focused on the future, those close to you appreciate how you help them see their own potential. You build relationships based on shared dreams and mutual growth.',
    idealActivities: [
      'Strategic planning and brainstorming',
      'Reading about innovation and trends',
      'Attending conferences and talks',
      'Starting new projects and ventures',
      'Mentoring aspiring entrepreneurs',
      'Discussing big ideas and future possibilities'
    ],
    growthAreas: [
      'Staying grounded in present reality',
      'Attention to practical details',
      'Patience with slower processes',
      'Celebrating small wins along the way'
    ],
    famousPeople: ['Elon Musk', 'Jane Jacobs', 'Steve Jobs'],
    color: '#3B82F6',
    gradient: ['#3B82F6', '#2563EB'],
  },
  'The Catalyst': {
    name: 'The Catalyst',
    tagline: 'Sparking transformation wherever you go',
    description: 'Catalysts have an electric energy that ignites change and motivates action. You challenge the status quo and inspire others to question, grow, and evolve. Your passionate nature and ability to see through pretense make you a powerful force for authentic transformation in both individuals and communities.',
    strengths: [
      'Fearless in challenging norms',
      'Energizes and motivates others',
      'Authentic and genuine',
      'Quick to identify problems',
      'Passionate advocate for change',
      'Cuts through superficiality'
    ],
    inRelationships: 'You push your friends to be their most authentic selves. Your honesty, while sometimes intense, comes from a place of genuine care. You create relationships based on truth and mutual growth. Friends know you\'ll always give it to them straight and support their transformation.',
    idealActivities: [
      'Leading social movements',
      'Public speaking and advocacy',
      'Coaching and personal development',
      'Challenging debates and discussions',
      'Facilitating workshops',
      'Driving organizational change'
    ],
    growthAreas: [
      'Tempering intensity with patience',
      'Accepting people where they are',
      'Recognizing not everyone wants change',
      'Finding peace with the process'
    ],
    famousPeople: ['Malala Yousafzai', 'Tony Robbins', 'Malcolm X'],
    color: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
  },
  'The Harmonizer': {
    name: 'The Harmonizer',
    tagline: 'Finding balance in a chaotic world',
    description: 'Harmonizers possess a unique ability to see all sides of a situation and bring disparate elements into balance. You create peace and understanding wherever you go, helping others find common ground. Your diplomatic nature and fairness make you a trusted mediator and friend.',
    strengths: [
      'Exceptional diplomacy skills',
      'Fair and balanced perspective',
      'Natural conflict resolution',
      'Creates peaceful environments',
      'Helps others find compromise',
      'Patient and understanding listener'
    ],
    inRelationships: 'You bring calm and clarity to your relationships. Friends appreciate your ability to see multiple perspectives and help them find balance in their own lives. You create harmony in group settings and have a gift for making everyone feel heard. Your presence is soothing and stabilizing.',
    idealActivities: [
      'Meditation and mindfulness practices',
      'Facilitating group discussions',
      'Conflict mediation and resolution',
      'Creating balanced living spaces',
      'Yoga and tai chi',
      'Bringing people together for dialogue'
    ],
    growthAreas: [
      'Taking a firm stance when needed',
      'Accepting that some conflict is healthy',
      'Prioritizing your own needs',
      'Being okay with imperfect solutions'
    ],
    famousPeople: ['Nelson Mandela', 'Thich Nhat Hanh', 'Ruth Bader Ginsburg'],
    color: '#14B8A6',
    gradient: ['#14B8A6', '#0D9488'],
  },
  'The Maverick': {
    name: 'The Maverick',
    tagline: 'Blazing trails where none exist',
    description: 'Mavericks are fiercely independent spirits who refuse to be confined by convention. You forge your own path with confidence and authenticity, inspiring others to embrace their uniqueness. Your originality and courage to stand alone make you a trendsetter and revolutionary thinker.',
    strengths: [
      'Fiercely independent',
      'Original and innovative thinking',
      'Courageous in being different',
      'Authentic self-expression',
      'Resilient to social pressure',
      'Natural trendsetter'
    ],
    inRelationships: 'You attract kindred spirits who value authenticity over conformity. Your friendships are based on mutual respect for individuality and freedom. While you may seem aloof, those who truly know you understand your fierce loyalty. You inspire others to embrace their own uniqueness.',
    idealActivities: [
      'Pursuing unconventional careers',
      'Starting innovative projects',
      'Expressing unique style and identity',
      'Challenging societal norms',
      'Solo adventures and exploration',
      'Creating original art or music'
    ],
    growthAreas: [
      'Accepting help from others',
      'Recognizing value in tradition',
      'Building deeper connections',
      'Balancing independence with community'
    ],
    famousPeople: ['Prince', 'Lady Gaga', 'Richard Branson'],
    color: '#F97316',
    gradient: ['#F97316', '#EA580C'],
  },
};
