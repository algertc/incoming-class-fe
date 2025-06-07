import type { Post } from '../components/PostCard';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true
    },
    content: 'Just submitted my final project for CS50! The course was challenging but incredibly rewarding. Anyone else taking it this semester?',
    images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Emily Chen',
      avatar: 'https://i.pravatar.cc/150?img=5',
      verified: true
    },
    content: 'Looking for study partners for the upcoming MCAT exam! I\'m focusing on biochemistry and organic chemistry sections. DM me if interested in forming a virtual study group.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Marcus Williams',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    content: 'Just accepted my summer internship offer at Google! So excited to be joining the Android development team. Any tips from people who\'ve interned there before?',
    images: ['https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1047&q=80'],
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: 'Sophia Martinez',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    content: 'Campus tour with my family today! Here are some highlights from the beautiful engineering building and the new student center.',
    images: [
      'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
  },
  {
    id: '5',
    author: {
      id: 'user5',
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true
    },
    content: 'Just published my first research paper in the Journal of Computational Biology! It\'s been a long journey, but so worth it. Thanks to everyone who supported me through this process.',
    images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '6',
    author: {
      id: 'user6',
      name: 'Jessica Taylor',
      avatar: 'https://i.pravatar.cc/150?img=15',
      verified: false
    },
    content: 'Study setup for finals week! Coffee, textbooks, and lots of determination. What does your study space look like?',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30 hours ago
  },
  {
    id: '7',
    author: {
      id: 'user7',
      name: 'Ryan Foster',
      avatar: 'https://i.pravatar.cc/150?img=20',
      verified: true
    },
    content: 'Campus coffee shop is having a flash sale! 50% off all drinks for the next 2 hours. Perfect timing for finals week caffeine addiction.',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'],
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
  },
  {
    id: '8',
    author: {
      id: 'user8',
      name: 'Maya Patel',
      avatar: 'https://i.pravatar.cc/150?img=25',
      verified: false
    },
    content: 'Amazing weekend at the hackathon! Our team built an app for food waste reduction. Here are some shots from the event and our final presentation.',
    images: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '9',
    author: {
      id: 'user9',
      name: 'Carlos Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=14',
      verified: true
    },
    content: 'Europe study abroad trip highlights! 🇪🇺 Visited 7 countries in 3 weeks. From the Eiffel Tower to the Colosseum, every moment was magical. Can\'t wait to share all the stories!',
    images: [
      'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Paris
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // London
      'https://images.unsplash.com/photo-1529260830199-42c24126f198?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Berlin
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Rome
      'https://images.unsplash.com/photo-1544279904-3ce22b5dd81f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Amsterdam
      'https://images.unsplash.com/photo-1585155770768-396125f2e6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Barcelona
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'  // Vienna
    ],
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: '10',
    author: {
      id: 'user10',
      name: 'Aisha Okonkwo',
      avatar: 'https://i.pravatar.cc/150?img=16',
      verified: false
    },
    content: 'Robotics competition was incredible! Our team worked for months on this autonomous robot. Here\'s the journey from design sketches to the final competition. We placed 3rd! 🥉🤖',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Robot design
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Workshop
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Programming
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Testing
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Competition day
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Team working
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Final robot
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Awards ceremony
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Team celebration
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'  // Group photo
    ],
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000), // 4 days ago
  }
];

export default MOCK_POSTS; 