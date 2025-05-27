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
  }
];

export default MOCK_POSTS; 