import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../store/auth.store';
import type { User } from '../../../models/user.model';
import type { Post } from '../../feed/components/PostCard';

export const useProfileData = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<User | null>(null);

  // Mock user posts data
  const [userPosts] = useState<Post[]>([
    {
      id: 'user-post-1',
      author: {
        id: 'current-user',
        name: user?.firstName + ' ' + user?.lastName || 'Current User',
        avatar: user?.profilePicture || 'https://i.pravatar.cc/150?img=50',
        verified: true
      },
      content: 'Excited to start my college journey! Looking forward to meeting new people and exploring all the opportunities ahead. Any tips for incoming freshmen?',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      likes: 42,
      comments: 12,
      shares: 2,
      isLiked: false,
    },
    {
      id: 'user-post-2',
      author: {
        id: 'current-user',
        name: user?.firstName + ' ' + user?.lastName || 'Current User',
        avatar: user?.profilePicture || 'https://i.pravatar.cc/150?img=50',
        verified: true
      },
      content: 'Just finished my campus tour! The facilities are amazing, especially the new library and student center. Can\'t wait to start classes here!',
      images: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      likes: 28,
      comments: 8,
      shares: 1,
      isLiked: true,
    }
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setProfileData(user);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return {
    profileData,
    setProfileData,
    userPosts,
    isLoading,
    user
  };
}; 