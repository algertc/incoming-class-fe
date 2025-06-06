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
    likes: 42,
    comments: 8,
    shares: 3
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
    likes: 18,
    comments: 4,
    shares: 1
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
    likes: 156,
    comments: 23,
    shares: 7
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: 'Sophia Martinez',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    content: 'Anyone else struggling with registration for next semester? All the classes I need are already full, and I\'m only a sophomore. The registration system needs serious improvement!',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    likes: 87,
    comments: 32,
    shares: 2
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
    likes: 211,
    comments: 45,
    shares: 18
  },
  {
    id: '6',
    author: {
      id: 'user6',
      name: 'Jessica Taylor',
      avatar: 'https://i.pravatar.cc/150?img=15',
      verified: false
    },
    content: 'Finally finished my economics midterm! That was brutal. Time to relax with some Netflix and pizza. What are your favorite study snacks?',
    timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30 hours ago
    likes: 64,
    comments: 12,
    shares: 1
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
    likes: 129,
    comments: 28,
    shares: 15
  },
  {
    id: '8',
    author: {
      id: 'user8',
      name: 'Maya Patel',
      avatar: 'https://i.pravatar.cc/150?img=25',
      verified: false
    },
    content: 'Just got back from the career fair! So many amazing opportunities. Pro tip: bring multiple copies of your resume and practice your elevator pitch beforehand.',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    likes: 95,
    comments: 16,
    shares: 8
  }
];

export default MOCK_POSTS; 