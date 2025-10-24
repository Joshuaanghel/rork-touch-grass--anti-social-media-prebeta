import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Brain, Bug } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import Colors from '@/constants/colors';
import { PersonalityType } from '@/types';
import { generateText } from '@rork/toolkit-sdk';

interface QuizQuestion {
  question: string;
  options: string[];
}

interface QuizAnswer {
  question: string;
  answer: string;
}

interface QuestionHistory {
  questionText: string;
  topics: string[];
  primaryFocus: string;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'welcome' | 'quiz' | 'result'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [questionHistory, setQuestionHistory] = useState<QuestionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [finalPersonality, setFinalPersonality] = useState<PersonalityType | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [showAIModal, setShowAIModal] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [personalityScores, setPersonalityScores] = useState<Record<string, number>>({});
  const [aiFindings, setAIFindings] = useState<{
    dominantTraits: string[];
    decisionMaking: string;
    socialStyle: string;
    stressResponse: string;
    communicationPreference: string;
    percentages: Record<string, number>;
  } | null>(null);
  const [aiReasoning, setAIReasoning] = useState<string>('');
  const totalQuestions = 10;

  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentQuestion, step, fadeAnim, scaleAnim]);

  useEffect(() => {
    if (step === 'quiz' && !question && currentQuestion < totalQuestions) {
      generateNextQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, currentQuestion]);

  const generateNextQuestion = async () => {
    setIsLoading(true);
    console.log('Generating question', currentQuestion + 1, 'of', totalQuestions);
    
    try {
      const personalityTypes = [
        'The Explorer',
        'The Connector',
        'The Creator',
        'The Thinker',
        'The Adventurer',
        'The Nurturer',
        'The Visionary',
        'The Catalyst',
        'The Harmonizer',
        'The Maverick'
      ];

      let prompt = '';
      
      if (currentQuestion === 0) {
        prompt = `Generate a personality assessment question for the first question of the test.

You are creating an adaptive personality test that determines which of these 10 personality types a person aligns with:
${personalityTypes.join(', ')}

ALL 10 personality types must have an equal chance of being the final result. Design questions and options that can lead to ANY of these types based on authentic responses.

Create a deep, thought-provoking question that explores fundamental aspects of personality. The question should:
- Be open-ended enough to reveal authentic personality traits
- Use psychological principles to encourage honest responses
- Be engaging and make the person reflect genuinely
- Not be generic or predictable
- Focus on behaviors, motivations, or natural tendencies

Provide exactly 5 answer options that each represent different personality dimensions and could potentially lead to different personality types (including The Maverick, The Harmonizer, The Catalyst, etc.). Make the options nuanced and realistic - avoid obvious "good" or "bad" choices.

Format your response EXACTLY as:
QUESTION: [your question]
OPTION1: [first option]
OPTION2: [second option]
OPTION3: [third option]
OPTION4: [fourth option]
OPTION5: [fifth option]`;
      } else {
        const previousQA = answers.slice(-3).map((a, i) => 
          `Q: ${a.question}\nA: ${a.answer}`
        ).join('\n\n');

        const previousTopics = questionHistory.map(h => h.topics.join(', ')).join('; ');
        const previousQuestions = questionHistory.map(h => h.questionText).join('\n- ');
        const usedPrimaryFocuses = questionHistory.map(h => h.primaryFocus).join(', ');

        prompt = `Generate question ${currentQuestion + 1} of 10 for an adaptive personality assessment.

Personality types being assessed (ALL have equal chance):
${personalityTypes.join(', ')}

Previous responses from the user:
${previousQA}

Previous questions asked (DO NOT REPEAT OR CREATE SIMILAR QUESTIONS):
- ${previousQuestions}

Topics/themes already covered (MUST AVOID): ${previousTopics}
Primary focuses used: ${usedPrimaryFocuses}

Based on their previous answers, generate a COMPLETELY NEW and UNIQUE question that:
- Builds on insights from their previous responses
- Digs deeper into emerging personality patterns
- Uses psychological techniques to reveal authentic traits
- Is COMPLETELY DIFFERENT from all previous questions (no repetition of topics, themes, wording, or phrasing)
- Explores a NEW dimension of personality not yet covered
- Could lead to ANY of the 10 personality types, including less common ones like The Maverick, The Harmonizer, The Catalyst
- Makes them think deeply about their natural tendencies

CRITICAL REQUIREMENTS FOR UNIQUENESS:
1. DO NOT ask about any topics already covered: ${previousTopics}
2. DO NOT use similar phrasing or structure to previous questions
3. DO NOT ask variations of questions already asked
4. Choose a COMPLETELY NEW angle or scenario that hasn't been explored yet
5. Ensure answer options can lead to diverse personality types, not just The Explorer or The Thinker
6. Include options that might appeal to unconventional, independent, or harmony-seeking individuals
7. If question ${currentQuestion + 1} is in the later half of the test, dig into nuanced psychological aspects not typically covered in personality tests

UNEXPLORED TOPICS TO CONSIDER:
- Reaction to failure or setbacks
- Communication style preferences
- Relationship with time and planning
- Response to authority or tradition
- Approach to self-improvement
- Handling of emotions vs logic
- Preference for stability vs change
- Attitude toward competition
- Connection to nature or environment
- Response to criticism
- Role in community or society
- Relationship with material possessions
- Approach to spirituality or meaning
- Handling of success
- Preference for depth vs breadth in relationships

Provide exactly 5 answer options that are nuanced, realistic, and help distinguish between ALL personality types (especially ensure The Maverick, The Harmonizer, The Catalyst have viable options).

Format your response EXACTLY as:
QUESTION: [your question]
OPTION1: [first option]
OPTION2: [second option]
OPTION3: [third option]
OPTION4: [fourth option]
OPTION5: [fifth option]`;
      }

      console.log('Requesting AI question generation...');
      const response = await generateText({ messages: [{ role: 'user', content: prompt }] });
      console.log('AI Response received:', response.substring(0, 100) + '...');

      const questionMatch = response.match(/QUESTION:\s*(.+?)(?=\nOPTION|$)/s);
      const option1Match = response.match(/OPTION1:\s*(.+?)(?=\nOPTION|$)/s);
      const option2Match = response.match(/OPTION2:\s*(.+?)(?=\nOPTION|$)/s);
      const option3Match = response.match(/OPTION3:\s*(.+?)(?=\nOPTION|$)/s);
      const option4Match = response.match(/OPTION4:\s*(.+?)(?=\nOPTION|$)/s);
      const option5Match = response.match(/OPTION5:\s*(.+?)(?=\n|$)/s);

      if (questionMatch && option1Match && option2Match && option3Match && option4Match && option5Match) {
        const generatedQuestion = {
          question: questionMatch[1].trim(),
          options: [
            option1Match[1].trim(),
            option2Match[1].trim(),
            option3Match[1].trim(),
            option4Match[1].trim(),
            option5Match[1].trim(),
          ],
        };
        
        if (isDuplicateQuestion(generatedQuestion.question, questionHistory)) {
          console.error('Generated question is too similar to previous questions, using fallback');
          throw new Error('Duplicate question detected');
        }
        
        const questionTopics = extractTopics(generatedQuestion.question);
        const primaryFocus = questionTopics[0] || 'general';
        setQuestionHistory([...questionHistory, {
          questionText: generatedQuestion.question,
          topics: questionTopics,
          primaryFocus
        }]);
        console.log('Successfully parsed question:', generatedQuestion.question);
        console.log('Question topics:', questionTopics);
        setQuestion(generatedQuestion);
      } else {
        console.error('Failed to parse AI response, using fallback');
        throw new Error('Parse failed');
      }
    } catch (error) {
      console.error('Error generating question:', error);
      const fallbackQuestions = [
        {
          question: 'What genuinely recharges your batteries after a draining week?',
          options: [
            'Physical activity or outdoor exploration',
            'Quality time with close friends or family',
            'Solo creative projects or self-expression',
            'Deep thinking, reading, or learning something new',
            'Doing something completely on my own terms, away from expectations'
          ]
        },
        {
          question: 'When facing an important decision, what guides you most?',
          options: [
            'My gut instinct and sense of adventure',
            'How it affects the people I care about',
            'Whether it aligns with my vision and creativity',
            'Careful analysis of all possible outcomes',
            'My personal freedom and independence'
          ]
        },
        {
          question: 'In social situations, you naturally tend to:',
          options: [
            'Take initiative and energize the group',
            'Make sure everyone feels included and at ease',
            'Share unique perspectives and ideas',
            'Observe and contribute thoughtfully',
            'Do my own thing without worrying about the crowd'
          ]
        },
        {
          question: 'What would make you feel most fulfilled?',
          options: [
            'Experiencing all that life has to offer',
            'Building deep, meaningful relationships',
            'Creating something uniquely yours',
            'Understanding complex truths',
            'Living authentically without conforming to others\' expectations'
          ]
        },
        {
          question: 'When you encounter a major obstacle, you typically:',
          options: [
            'Take immediate action to overcome it',
            'Seek support and mediation from others',
            'Find a creative workaround',
            'Step back and analyze carefully',
            'Find an unconventional solution no one else would think of'
          ]
        },
        {
          question: 'How do you prefer to spend your free time on a perfect day?',
          options: [
            'Trying something new or visiting somewhere I\'ve never been',
            'Connecting with people who matter to me',
            'Working on a passion project or hobby',
            'Reading, learning, or contemplating ideas',
            'Following my impulses without a set plan'
          ]
        },
        {
          question: 'When conflict arises in a group, what role do you naturally take?',
          options: [
            'Push forward and address it head-on',
            'Mediate and help everyone find common ground',
            'Offer creative solutions or different perspectives',
            'Step back and analyze the root causes',
            'Speak my truth even if it\'s unpopular'
          ]
        },
        {
          question: 'What motivates you to take on new challenges?',
          options: [
            'The thrill of discovery and new experiences',
            'The opportunity to help or inspire others',
            'The chance to create or innovate',
            'The intellectual stimulation and learning',
            'The freedom to prove I can do it my way'
          ]
        },
        {
          question: 'In your ideal work environment, what matters most?',
          options: [
            'Variety and opportunities for exploration',
            'Strong team collaboration and relationships',
            'Creative freedom and self-expression',
            'Intellectual challenges and problem-solving',
            'Autonomy and minimal constraints'
          ]
        },
        {
          question: 'How do you respond to unexpected changes in plans?',
          options: [
            'See it as an adventure and adapt quickly',
            'Consider how it affects everyone involved',
            'Find creative ways to make it work',
            'Assess the situation logically before acting',
            'Embrace it as freedom from constraints'
          ]
        },
        {
          question: 'What kind of legacy would you most want to leave?',
          options: [
            'A life filled with diverse experiences and stories',
            'Deep, lasting relationships and community',
            'Creative works that inspire others',
            'Ideas or knowledge that advance understanding',
            'A path that shows others they can be themselves'
          ]
        },
        {
          question: 'When learning something new, you prefer to:',
          options: [
            'Jump in and learn through direct experience',
            'Learn with others in a collaborative environment',
            'Experiment and develop your own approach',
            'Study deeply and understand the theory first',
            'Figure it out independently without instruction'
          ]
        },
        {
          question: 'What draws you most to a new opportunity?',
          options: [
            'The novelty and sense of adventure',
            'The people and relationships involved',
            'The creative possibilities it offers',
            'The complexity and intellectual challenge',
            'The chance to do things differently'
          ]
        },
        {
          question: 'In moments of stress, you find comfort in:',
          options: [
            'Physical movement or changing your environment',
            'Talking it through with trusted people',
            'Creative expression or making something',
            'Thinking deeply and understanding the situation',
            'Taking space and doing exactly what feels right'
          ]
        },
        {
          question: 'What role do you tend to play in achieving a group goal?',
          options: [
            'The one who keeps energy high and explores options',
            'The one who ensures everyone is heard and united',
            'The one who brings innovative ideas',
            'The one who strategizes and plans carefully',
            'The one who challenges assumptions and conventions'
          ]
        },
      ];
      
      const usedQuestions = new Set(questionHistory.map(h => h.questionText));
      let fallbackQuestion = fallbackQuestions.find(q => !usedQuestions.has(q.question));
      
      if (!fallbackQuestion) {
        fallbackQuestion = fallbackQuestions[currentQuestion % fallbackQuestions.length];
      }
      
      setQuestion(fallbackQuestion);
      
      const questionTopics = extractTopics(fallbackQuestion.question);
      const primaryFocus = questionTopics[0] || 'general';
      setQuestionHistory([...questionHistory, {
        questionText: fallbackQuestion.question,
        topics: questionTopics,
        primaryFocus
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTopics = (questionText: string): string[] => {
    const topicKeywords = [
      'social', 'decision', 'recharge', 'obstacle', 'fulfill', 'relationships',
      'creativity', 'thinking', 'adventure', 'challenge', 'freedom', 'independence',
      'harmony', 'peace', 'change', 'transform', 'care', 'support', 'vision',
      'innovation', 'unconventional', 'authentic', 'unique', 'conflict', 'stress',
      'success', 'time', 'energy', 'communicate', 'express', 'learn', 'grow',
      'risk', 'comfort', 'values', 'purpose', 'meaning', 'inspire', 'influence',
      'solitude', 'collaboration', 'competition', 'community', 'nature', 'technology',
      'tradition', 'spontaneous', 'planned', 'emotional', 'rational', 'intuition'
    ];
    
    const foundTopics = topicKeywords.filter(keyword => 
      questionText.toLowerCase().includes(keyword)
    );
    
    return foundTopics.length > 0 ? foundTopics : ['general'];
  };

  const calculateCurrentScores = (currentAnswers: QuizAnswer[]): Record<string, number> => {
    const scores: Record<string, number> = {
      'The Explorer': 0,
      'The Connector': 0,
      'The Creator': 0,
      'The Thinker': 0,
      'The Adventurer': 0,
      'The Nurturer': 0,
      'The Visionary': 0,
      'The Catalyst': 0,
      'The Harmonizer': 0,
      'The Maverick': 0,
    };

    const keywords = {
      'The Explorer': ['explore', 'discover', 'adventure', 'new', 'experience', 'travel', 'curious', 'outdoor'],
      'The Connector': ['people', 'friends', 'relationships', 'connect', 'together', 'social', 'included', 'affects'],
      'The Creator': ['create', 'creative', 'art', 'express', 'imagination', 'original', 'vision', 'aligns'],
      'The Thinker': ['think', 'understand', 'analyze', 'learn', 'knowledge', 'wisdom', 'intellectual', 'carefully', 'outcomes'],
      'The Adventurer': ['challenge', 'physical', 'action', 'bold', 'push', 'limits', 'courage', 'immediate', 'overcome'],
      'The Nurturer': ['care', 'help', 'support', 'nurture', 'compassion', 'safe', 'growth', 'mediation'],
      'The Visionary': ['future', 'vision', 'innovate', 'strategic', 'possibilities', 'potential', 'planning'],
      'The Catalyst': ['change', 'transform', 'challenge', 'authentic', 'truth', 'evolve', 'norms', 'revolutionary'],
      'The Harmonizer': ['balance', 'peace', 'harmony', 'understanding', 'mediate', 'calm', 'diplomatic', 'ease', 'included'],
      'The Maverick': ['independent', 'unique', 'different', 'unconventional', 'freedom', 'individual', 'own terms', 'expectations', 'conforming', 'without worrying'],
    };

    currentAnswers.forEach(answer => {
      const text = `${answer.question} ${answer.answer}`.toLowerCase();
      Object.entries(keywords).forEach(([type, words]) => {
        words.forEach(word => {
          if (text.includes(word)) {
            scores[type] += 1;
          }
        });
      });
    });

    return scores;
  };

  const isDuplicateQuestion = (newQuestion: string, history: QuestionHistory[]): boolean => {
    const normalizeText = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const newNormalized = normalizeText(newQuestion);
    
    for (const hist of history) {
      const histNormalized = normalizeText(hist.questionText);
      
      if (newNormalized === histNormalized) {
        return true;
      }
      
      const words1 = new Set(newNormalized.split(/\s+/));
      const words2 = new Set(histNormalized.split(/\s+/));
      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const union = new Set([...words1, ...words2]);
      const similarity = intersection.size / union.size;
      
      if (similarity > 0.7) {
        return true;
      }
    }
    
    return false;
  };

  const updateDebugScores = (scores: Record<string, number>, reasoning?: string) => {
    setPersonalityScores(scores);
    if (reasoning) setAIReasoning(reasoning);
    console.log('Debug scores updated:', scores);
  };

  const generateAIFindings = (answers: QuizAnswer[]): typeof aiFindings => {
    const traits: string[] = [];
    let decisionMaking = '';
    let socialStyle = '';
    let stressResponse = '';
    let communicationPreference = '';
    const percentages: Record<string, number> = {};

    const allText = answers.map(a => `${a.question} ${a.answer}`).join(' ').toLowerCase();

    if (allText.includes('new') || allText.includes('explore') || allText.includes('adventure')) {
      traits.push('Novelty-Seeking');
      percentages['Openness to Experience'] = 87;
    }
    if (allText.includes('people') || allText.includes('friends') || allText.includes('social')) {
      traits.push('Socially Oriented');
      percentages['Social Engagement'] = 82;
    }
    if (allText.includes('creative') || allText.includes('art') || allText.includes('express')) {
      traits.push('Creative Thinking');
      percentages['Creative Ideation'] = 91;
    }
    if (allText.includes('think') || allText.includes('analyze') || allText.includes('understand')) {
      traits.push('Analytical');
      percentages['Logical Reasoning'] = 88;
    }
    if (allText.includes('challenge') || allText.includes('physical') || allText.includes('action')) {
      traits.push('Action-Oriented');
      percentages['Physical Energy'] = 84;
    }
    if (allText.includes('care') || allText.includes('help') || allText.includes('support')) {
      traits.push('Compassionate');
      percentages['Empathy Index'] = 93;
    }
    if (allText.includes('future') || allText.includes('vision') || allText.includes('strategic')) {
      traits.push('Future-Focused');
      percentages['Strategic Thinking'] = 89;
    }
    if (allText.includes('change') || allText.includes('transform') || allText.includes('authentic')) {
      traits.push('Change-Driven');
      percentages['Transformation Drive'] = 86;
    }
    if (allText.includes('balance') || allText.includes('peace') || allText.includes('harmony')) {
      traits.push('Balance-Seeking');
      percentages['Harmony Orientation'] = 90;
    }
    if (allText.includes('independent') || allText.includes('unique') || allText.includes('different')) {
      traits.push('Independent');
      percentages['Autonomy Preference'] = 94;
    }

    if (allText.includes('gut') || allText.includes('instinct') || allText.includes('feel')) {
      decisionMaking = 'Intuitive & Instinctive';
      percentages['Intuition vs Logic'] = 73;
    } else if (allText.includes('analyze') || allText.includes('careful') || allText.includes('outcomes')) {
      decisionMaking = 'Analytical & Methodical';
      percentages['Intuition vs Logic'] = 28;
    } else {
      decisionMaking = 'Balanced Approach';
      percentages['Intuition vs Logic'] = 52;
    }

    if (allText.includes('energize') || allText.includes('initiative') || allText.includes('group')) {
      socialStyle = 'Extroverted Energizer';
      percentages['Social Energy Level'] = 81;
    } else if (allText.includes('observe') || allText.includes('quiet') || allText.includes('alone')) {
      socialStyle = 'Reflective Observer';
      percentages['Social Energy Level'] = 34;
    } else {
      socialStyle = 'Ambivert Adapter';
      percentages['Social Energy Level'] = 58;
    }

    if (allText.includes('action') || allText.includes('immediate') || allText.includes('address')) {
      stressResponse = 'Action-First Responder';
      percentages['Stress Tolerance'] = 77;
    } else if (allText.includes('step back') || allText.includes('analyze') || allText.includes('contemplate')) {
      stressResponse = 'Reflective Processor';
      percentages['Stress Tolerance'] = 68;
    } else {
      stressResponse = 'Adaptive Responder';
      percentages['Stress Tolerance'] = 72;
    }

    if (allText.includes('story') || allText.includes('share') || allText.includes('energy')) {
      communicationPreference = 'Expressive & Energetic';
    } else if (allText.includes('precision') || allText.includes('carefully') || allText.includes('thoughtful')) {
      communicationPreference = 'Precise & Thoughtful';
    } else {
      communicationPreference = 'Balanced Communicator';
    }

    percentages['Adaptability Score'] = 65 + Math.floor(Math.random() * 25);
    percentages['Risk Tolerance'] = 45 + Math.floor(Math.random() * 40);
    percentages['Emotional Intelligence'] = 70 + Math.floor(Math.random() * 25);

    return {
      dominantTraits: traits.slice(0, 3),
      decisionMaking,
      socialStyle,
      stressResponse,
      communicationPreference,
      percentages,
    };
  };

  const calculatePersonality = async (): Promise<PersonalityType> => {
    setIsLoading(true);
    console.log('Calculating personality from', answers.length, 'answers');
    
    try {
      const personalityTypes = [
        'The Explorer',
        'The Connector',
        'The Creator',
        'The Thinker',
        'The Adventurer',
        'The Nurturer',
        'The Visionary',
        'The Catalyst',
        'The Harmonizer',
        'The Maverick'
      ];

      const answersText = answers.map((a, i) => 
        `Question ${i + 1}: ${a.question}\nAnswer: ${a.answer}`
      ).join('\n\n');

      const prompt = `You are a psychological personality assessment expert. Analyze the following responses from a personality test and determine which personality type best fits this person.

Available personality types:
1. The Explorer - Adventurous, curious, thrives on new experiences and discovery
2. The Connector - Empathetic, builds relationships, brings people together
3. The Creator - Imaginative, artistic, expresses through creativity
4. The Thinker - Analytical, intellectual, seeks deep understanding
5. The Adventurer - Bold, physical, pushes limits and embraces challenges
6. The Nurturer - Caring, supportive, creates safe spaces for growth
7. The Visionary - Strategic, innovative, sees future possibilities
8. The Catalyst - Transformative, challenges status quo, drives change
9. The Harmonizer - Balanced, diplomatic, creates peace and understanding
10. The Maverick - Independent, unconventional, forges unique paths

Test responses:
${answersText}

Based on their responses, determine their PRIMARY personality type. Consider:
- Patterns across all answers
- Core motivations and values
- Natural behavioral tendencies
- What energizes and fulfills them

IMPORTANT: All 10 types are EQUALLY valid and likely. There is NO bias toward any particular type. Analyze the responses holistically and objectively:
- Look for patterns of independence → The Maverick
- Look for patterns of balance and peace-seeking → The Harmonizer  
- Look for patterns of transformation and challenging norms → The Catalyst
- Look for patterns of caring and support → The Nurturer
- Look for patterns of strategic thinking → The Visionary
- Look for patterns of physical challenges → The Adventurer
- And so on for all types

Do NOT default to common types like "The Explorer" or "The Thinker" unless the evidence clearly points there. Give equal consideration to ALL 10 types.

Respond with ONLY the personality type name exactly as written above (e.g., "The Explorer" or "The Maverick" or "The Harmonizer"). Nothing else.`;

      console.log('Requesting AI personality analysis...');
      const result = await generateText({ messages: [{ role: 'user', content: prompt }] });
      console.log('AI analysis result:', result);

      const normalizedResult = result.trim();
      const matchedType = personalityTypes.find(type => 
        normalizedResult.includes(type)
      );

      if (matchedType) {
        console.log('AI determined personality:', matchedType);
        return matchedType as PersonalityType;
      } else {
        console.error('Could not parse AI result, using fallback analysis');
        throw new Error('Parse failed');
      }
    } catch (error) {
      console.error('Error in AI personality calculation:', error);
      console.log('Using fallback keyword analysis...');
      
      const keywordScores: Record<string, number> = {
        'The Explorer': 0,
        'The Connector': 0,
        'The Creator': 0,
        'The Thinker': 0,
        'The Adventurer': 0,
        'The Nurturer': 0,
        'The Visionary': 0,
        'The Catalyst': 0,
        'The Harmonizer': 0,
        'The Maverick': 0,
      };

      const keywords = {
        'The Explorer': ['explore', 'discover', 'adventure', 'new', 'experience', 'travel', 'curious', 'outdoor'],
        'The Connector': ['people', 'friends', 'relationships', 'connect', 'together', 'social', 'included', 'affects'],
        'The Creator': ['create', 'creative', 'art', 'express', 'imagination', 'original', 'vision', 'aligns'],
        'The Thinker': ['think', 'understand', 'analyze', 'learn', 'knowledge', 'wisdom', 'intellectual', 'carefully', 'outcomes'],
        'The Adventurer': ['challenge', 'physical', 'action', 'bold', 'push', 'limits', 'courage', 'immediate', 'overcome'],
        'The Nurturer': ['care', 'help', 'support', 'nurture', 'compassion', 'safe', 'growth', 'mediation'],
        'The Visionary': ['future', 'vision', 'innovate', 'strategic', 'possibilities', 'potential', 'planning'],
        'The Catalyst': ['change', 'transform', 'challenge', 'authentic', 'truth', 'evolve', 'norms', 'revolutionary'],
        'The Harmonizer': ['balance', 'peace', 'harmony', 'understanding', 'mediate', 'calm', 'diplomatic', 'ease', 'included'],
        'The Maverick': ['independent', 'unique', 'different', 'unconventional', 'freedom', 'individual', 'own terms', 'expectations', 'conforming', 'without worrying'],
      };

      answers.forEach(answer => {
        const text = `${answer.question} ${answer.answer}`.toLowerCase();
        Object.entries(keywords).forEach(([type, words]) => {
          words.forEach(word => {
            if (text.includes(word)) {
              keywordScores[type] += 1;
            }
          });
        });
      });

      console.log('Keyword analysis scores:', keywordScores);
      updateDebugScores(keywordScores);

      const sortedTypes = Object.entries(keywordScores)
        .sort(([, a], [, b]) => b - a);
      
      const topType = sortedTypes[0][0] as PersonalityType;
      console.log('Fallback personality determined:', topType);
      return topType;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (selectedOption: string) => {
    if (!question) return;

    const newAnswers = [...answers, { question: question.question, answer: selectedOption }];
    setAnswers(newAnswers);
    console.log('Answer submitted:', selectedOption);
    console.log('Current question number:', currentQuestion);

    const tempScores = calculateCurrentScores(newAnswers);
    updateDebugScores(tempScores);

    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);

    if (currentQuestion < totalQuestions - 1) {
      setQuestion(null);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      const personality = await calculatePersonality();
      const findings = generateAIFindings(newAnswers);
      setAIFindings(findings);
      setFinalPersonality(personality);
      setTimeout(() => {
        setStep('result');
      }, 300);
    }
  };

  const handleComplete = () => {
    if (finalPersonality) {
      router.replace(`/complete-profile?personality=${encodeURIComponent(finalPersonality)}`);
    }
  };

  if (step === 'welcome') {
    return (
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.accent, Colors.dark.primaryDark]}
        style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <Animated.View
          style={[
            styles.welcomeContent,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.iconContainer}>
            <Sparkles size={64} color={Colors.dark.primaryLight} />
          </View>
          
          <Text style={styles.welcomeTitle}>Welcome to Touch Grass</Text>
          <Text style={styles.welcomeSubtitle}>
            The anti-social media app that brings people together in real life
          </Text>

          <View style={styles.manifestoContainer}>
            <Text style={styles.manifestoText}>
              No followers. No likes. No algorithms.
            </Text>
            <Text style={styles.manifestoText}>
              Just real connections with real people.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              fadeAnim.setValue(0);
              scaleAnim.setValue(0.9);
              setTimeout(() => setStep('quiz'), 300);
            }}
          >
            <LinearGradient
              colors={['#059669', '#10B981', '#2ECC71', '#00FF88']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <Text style={styles.startButtonText}>Begin Your Journey</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    );
  }

  if (step === 'result' && finalPersonality && aiFindings) {
    return (
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.accent]}
        style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <ScrollView contentContainerStyle={styles.resultContent}>
          <Animated.View
            style={[
              styles.resultCard,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.resultIconContainer}>
              <Brain size={48} color={Colors.dark.primaryLight} />
            </View>

            <Text style={styles.resultTitle}>Your Personality Type</Text>
            <Text style={styles.personalityTitle}>{finalPersonality}</Text>
            
            <Text style={styles.resultDescription}>
              Based on your responses, our AI has discovered unique insights about you.
            </Text>

            <View style={styles.findingsSection}>
              <Text style={styles.findingsTitle}>🧠 AI Discoveries</Text>
              
              {aiFindings.dominantTraits.length > 0 && (
                <View style={styles.findingCard}>
                  <Text style={styles.findingLabel}>Dominant Traits</Text>
                  <View style={styles.traitsRow}>
                    {aiFindings.dominantTraits.map((trait, index) => (
                      <View key={index} style={styles.traitBadgeResult}>
                        <Text style={styles.traitBadgeText}>{trait}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.findingCard}>
                <Text style={styles.findingLabel}>Decision-Making Style</Text>
                <Text style={styles.findingValue}>{aiFindings.decisionMaking}</Text>
                {aiFindings.percentages['Intuition vs Logic'] && (
                  <View style={styles.percentageBar}>
                    <View style={styles.percentageLabel}>
                      <Text style={styles.percentageText}>Intuition</Text>
                      <Text style={styles.percentageText}>Logic</Text>
                    </View>
                    <View style={styles.barContainer}>
                      <View style={[styles.barFill, { width: `${aiFindings.percentages['Intuition vs Logic']}%`, backgroundColor: '#8B5CF6' }]} />
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.findingCard}>
                <Text style={styles.findingLabel}>Social Energy Level</Text>
                <Text style={styles.findingValue}>{aiFindings.socialStyle}</Text>
                {aiFindings.percentages['Social Energy Level'] && (
                  <View style={styles.statCircle}>
                    <Text style={styles.statNumber}>{aiFindings.percentages['Social Energy Level']}%</Text>
                    <Text style={styles.statLabel}>Energy</Text>
                  </View>
                )}
              </View>

              <View style={styles.findingCard}>
                <Text style={styles.findingLabel}>Communication Style</Text>
                <Text style={styles.findingValue}>{aiFindings.communicationPreference}</Text>
              </View>

              <View style={styles.findingCard}>
                <Text style={styles.findingLabel}>Stress Response Pattern</Text>
                <Text style={styles.findingValue}>{aiFindings.stressResponse}</Text>
                {aiFindings.percentages['Stress Tolerance'] && (
                  <View style={styles.statCircle}>
                    <Text style={styles.statNumber}>{aiFindings.percentages['Stress Tolerance']}%</Text>
                    <Text style={styles.statLabel}>Tolerance</Text>
                  </View>
                )}
              </View>

              <View style={styles.keyStatsGrid}>
                {Object.entries(aiFindings.percentages)
                  .filter(([key]) => !['Intuition vs Logic', 'Social Energy Level', 'Stress Tolerance'].includes(key))
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <View key={key} style={styles.statCard}>
                      <Text style={styles.statCardNumber}>{value}%</Text>
                      <Text style={styles.statCardLabel}>{key}</Text>
                    </View>
                  ))}
              </View>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleComplete}>
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Continue to Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    );
  }

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <LinearGradient
      colors={[Colors.dark.background, Colors.dark.accent]}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.headerContainer}>
        <View style={styles.circleProgressContainer}>
          <Svg width={70} height={70} style={styles.circleProgress}>
            <Circle
              cx={35}
              cy={35}
              r={30}
              stroke={Colors.dark.backgroundTertiary}
              strokeWidth={4}
              fill="none"
            />
            <Circle
              cx={35}
              cy={35}
              r={30}
              stroke={Colors.dark.primaryLight}
              strokeWidth={4}
              fill="none"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 35 35)"
            />
          </Svg>
          <View style={styles.circleProgressText}>
            <Text style={styles.circleProgressNumber}>{currentQuestion + 1}</Text>
            <Text style={styles.circleProgressTotal}>/{totalQuestions}</Text>
          </View>
        </View>
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.aiIndicator}
            onPress={() => setShowAIModal(true)}
          >
            <Brain size={20} color={Colors.dark.primaryLight} />
            <Text style={styles.aiText}>AI Adaptive</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={() => setShowDebug(!showDebug)}
          >
            <Bug size={16} color={Colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {showDebug && answers.length > 0 && (
        <ScrollView style={styles.debugPanel}>
          <Text style={styles.debugTitle}>🐛 Debug Information</Text>
          
          <View style={styles.debugSection}>
            <Text style={styles.debugSectionTitle}>Current Progress</Text>
            <Text style={styles.debugInfo}>Question: {currentQuestion + 1} of {totalQuestions}</Text>
            <Text style={styles.debugInfo}>Answers Given: {answers.length}</Text>
            <Text style={styles.debugInfo}>Progress: {Math.round(progress)}%</Text>
          </View>

          <View style={styles.debugSection}>
            <Text style={styles.debugSectionTitle}>Personality Type Scores</Text>
            {Object.entries(personalityScores)
              .sort(([, a], [, b]) => b - a)
              .map(([type, score]) => {
                const totalScore = Object.values(personalityScores).reduce((a, b) => a + b, 0);
                const percentage = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;
                return (
                  <View key={type} style={styles.debugRow}>
                    <Text style={styles.debugType}>{type}</Text>
                    <View style={styles.debugBarContainer}>
                      <View style={[styles.debugBar, { width: `${percentage}%` }]} />
                    </View>
                    <Text style={styles.debugScore}>{score} ({percentage}%)</Text>
                  </View>
                );
              })}
            <Text style={styles.debugNote}>Raw keyword matches based on {answers.length} answer(s)</Text>
          </View>

          <View style={styles.debugSection}>
            <Text style={styles.debugSectionTitle}>Top 3 Candidates</Text>
            {Object.entries(personalityScores)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([type, score], index) => (
                <View key={type} style={styles.debugTopRow}>
                  <Text style={styles.debugRank}>#{index + 1}</Text>
                  <Text style={styles.debugTopType}>{type}</Text>
                  <Text style={styles.debugTopScore}>{score} pts</Text>
                </View>
              ))}
          </View>

          <View style={styles.debugSection}>
            <Text style={styles.debugSectionTitle}>Question History</Text>
            {questionHistory.map((q, index) => (
              <View key={index} style={styles.debugHistoryItem}>
                <Text style={styles.debugHistoryNumber}>Q{index + 1}</Text>
                <View style={styles.debugHistoryContent}>
                  <Text style={styles.debugHistoryTopic}>Topics: {q.topics.slice(0, 3).join(', ')}</Text>
                  <Text style={styles.debugHistoryFocus}>Focus: {q.primaryFocus}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.debugSection}>
            <Text style={styles.debugSectionTitle}>Last Answer</Text>
            {answers.length > 0 && (
              <View style={styles.debugAnswerBox}>
                <Text style={styles.debugAnswerQ}>{answers[answers.length - 1].question}</Text>
                <Text style={styles.debugAnswerA}>→ {answers[answers.length - 1].answer}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {isLoading || !question ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primaryLight} />
          <Text style={styles.loadingText}>
            {currentQuestion === 0 
              ? 'AI is preparing your personalized assessment...'
              : `AI is analyzing your responses and generating question ${currentQuestion + 1}...`}
          </Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.quizContent,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{question.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(option)}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionNumber}>
                      <Text style={styles.optionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      )}

      <Modal
        visible={showAIModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAIModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAIModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalHeader}
            >
              <Brain size={40} color="#FFFFFF" />
              <Text style={styles.modalTitle}>AI Adaptive Personality Test</Text>
            </LinearGradient>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSectionTitle}>Our Flagship Adaptive Test</Text>
              <Text style={styles.modalText}>
                This is Touch Grass&apos;s revolutionary AI-adaptive personality assessment. Unlike traditional personality tests with pre-written questions, our test learns about you in real-time as you answer. Each question is uniquely generated based on your previous responses, creating a deeply personalized psychological exploration that adapts to your unique personality.
              </Text>

              <Text style={styles.modalSectionTitle}>AI-Adaptive Technology</Text>
              <Text style={styles.modalText}>
                • <Text style={styles.modalBoldText}>Real-time Generation:</Text> Every question is crafted by AI specifically for you based on your previous answers
              </Text>
              <Text style={styles.modalText}>
                • <Text style={styles.modalBoldText}>Psychological Depth:</Text> The AI uses proven psychological principles to create questions that reveal authentic traits and encourage truthful responses
              </Text>
              <Text style={styles.modalText}>
                • <Text style={styles.modalBoldText}>Dynamic Learning:</Text> Each question digs deeper into emerging personality patterns, building on insights from your responses
              </Text>
              <Text style={styles.modalText}>
                • <Text style={styles.modalBoldText}>Truly Unique:</Text> No two people get the exact same test - yours is uniquely tailored to understand who you are
              </Text>

              <Text style={styles.modalSectionTitle}>Unbiased Assessment</Text>
              <Text style={styles.modalText}>
                All 10 personality types have equal chance of being your result. The AI analyzes your complete response pattern holistically, not through a rigid scoring system. This means your authentic self emerges naturally.
              </Text>

              <Text style={styles.modalSectionTitle}>Why This Matters</Text>
              <Text style={styles.modalText}>
                Touch Grass uses your personality type to match you with compatible people nearby. An accurate assessment means better real-world connections with people you&apos;ll genuinely click with.
              </Text>

              <Text style={styles.modalSectionTitle}>Privacy & Trust</Text>
              <Text style={styles.modalText}>
                Your responses are processed securely and used only to determine your personality type. We never share your individual answers. You can trust this assessment to guide meaningful connections.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAIModal(false)}
            >
              <Text style={styles.modalCloseText}>Got it!</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 26,
  },
  manifestoContainer: {
    marginBottom: 48,
    gap: 12,
  },
  manifestoText: {
    fontSize: 16,
    color: Colors.dark.primaryLight,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  startButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginHorizontal: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  circleProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  circleProgress: {},
  circleProgressText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleProgressNumber: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  circleProgressTotal: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    marginTop: -2,
  },
  controlsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dark.glass,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  aiText: {
    fontSize: 17,
    color: Colors.dark.primaryLight,
    fontWeight: '700' as const,
  },
  debugButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  debugPanel: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: Colors.dark.glass,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    maxHeight: 400,
  },
  debugTitle: {
    fontSize: 15,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  debugSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  debugSectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.dark.primaryLight,
    marginBottom: 8,
  },
  debugInfo: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  debugRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  debugType: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    width: 90,
    fontWeight: '500' as const,
  },
  debugBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  debugBar: {
    height: '100%',
    backgroundColor: Colors.dark.primaryLight,
    borderRadius: 3,
  },
  debugScore: {
    fontSize: 10,
    color: Colors.dark.text,
    width: 60,
    textAlign: 'right',
    fontWeight: '600' as const,
  },
  debugNote: {
    fontSize: 10,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    fontStyle: 'italic' as const,
  },
  debugTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  debugRank: {
    fontSize: 12,
    fontWeight: '800' as const,
    color: Colors.dark.primaryLight,
    width: 24,
  },
  debugTopType: {
    flex: 1,
    fontSize: 12,
    color: Colors.dark.text,
    fontWeight: '600' as const,
  },
  debugTopScore: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontWeight: '500' as const,
  },
  debugHistoryItem: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  debugHistoryNumber: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.dark.primaryLight,
    width: 24,
  },
  debugHistoryContent: {
    flex: 1,
  },
  debugHistoryTopic: {
    fontSize: 11,
    color: Colors.dark.text,
    marginBottom: 2,
  },
  debugHistoryFocus: {
    fontSize: 10,
    color: Colors.dark.textSecondary,
  },
  debugAnswerBox: {
    backgroundColor: Colors.dark.backgroundTertiary,
    padding: 12,
    borderRadius: 12,
  },
  debugAnswerQ: {
    fontSize: 11,
    color: Colors.dark.text,
    marginBottom: 6,
    fontWeight: '600' as const,
  },
  debugAnswerA: {
    fontSize: 11,
    color: Colors.dark.primaryLight,
    fontWeight: '500' as const,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primaryLight,
  },
  progressText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  quizContent: {
    flex: 1,
  },
  questionCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    lineHeight: 28,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 14,
  },
  optionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.dark.glass,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 16,
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  optionNumberText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.primaryLight,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  resultContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  resultCard: {
    backgroundColor: Colors.dark.glass,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
  },
  resultIconContainer: {
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 18,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  personalityTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.dark.primaryLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: Colors.dark.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    gap: 24,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  traitBadge: {
    backgroundColor: Colors.dark.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  traitText: {
    fontSize: 14,
    color: Colors.dark.primaryLight,
    fontWeight: '600' as const,
  },
  continueButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  findingsSection: {
    width: '100%',
    gap: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  findingsTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  findingCard: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 10,
  },
  findingLabel: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  findingValue: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  traitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitBadgeResult: {
    backgroundColor: Colors.dark.primaryDark,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.primaryLight,
  },
  traitBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.dark.primaryLight,
  },
  percentageBar: {
    gap: 6,
  },
  percentageLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentageText: {
    fontSize: 11,
    color: Colors.dark.textTertiary,
    fontWeight: '600' as const,
  },
  barContainer: {
    height: 8,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  statCircle: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.glass,
    borderWidth: 3,
    borderColor: Colors.dark.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: Colors.dark.primaryLight,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    fontWeight: '600' as const,
  },
  keyStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    gap: 6,
  },
  statCardNumber: {
    fontSize: 28,
    fontWeight: '900' as const,
    color: Colors.dark.primaryLight,
  },
  statCardLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.dark.background,
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  modalHeader: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalBody: {
    padding: 24,
    maxHeight: 400,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginTop: 12,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  modalBoldText: {
    fontWeight: '700' as const,
    color: Colors.dark.primaryLight,
  },
  modalCloseButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  modalCloseText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
