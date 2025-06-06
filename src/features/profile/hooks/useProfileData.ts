import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../store/auth.store';
import type { Post } from '../../feed/components/PostCard';

// Extended user type to add profile completion fields
interface ExtendedUser {
  major?: string;
  hometown?: string;
  instagram?: string;
  snapchat?: string;
  lookingForRoommate?: boolean;
}

// Profile data interface
export interface ProfileData {
  coverImage: string;
  academic: {
    major: string;
    university: string;
    batch: string;
  };
  traits: {
    sleepSchedule: string;
    cleanliness: string;
    guests: string;
    studying: string;
    substances: string;
  };
  personality: string[];
  physicalActivity: string[];
  pastimes: string[];
  food: string[];
  location: {
    hometown: string;
    country: string;
  };
  contact: {
    instagram: string;
    snapchat: string;
  };
  lookingForRoommate: boolean;
  stats: {
    profileViews: number;
    connections: number;
    posts: number;
  };
  name: string;
  profilePicture: string;
  bio: string;
  designation: string;
  isPremium: boolean;
  profileCompletion: number;
}

export const useProfileData = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Mock user posts data
  const [userPosts] = useState<Post[]>([
    {
      id: 'user-post-1',
      author: {
        id: user?.id || 'current-user',
        name: user ? `${user.firstName} ${user.lastName}` : 'Your Name',
        avatar: user?.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        verified: true
      },
      content: 'Looking for roommates for the upcoming semester! I\'m a CS major and I\'m clean, organized, and respectful of quiet hours. DM me if interested!',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 15,
      comments: 3,
      shares: 2
    },
    {
      id: 'user-post-2',
      author: {
        id: user?.id || 'current-user',
        name: user ? `${user.firstName} ${user.lastName}` : 'Your Name',
        avatar: user?.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        verified: true
      },
      content: 'Just aced my final exams! So ready for summer break. Anyone planning to take summer courses?',
      images: ['https://images.unsplash.com/photo-1623966759174-3b464b0bd50c?q=80&w=1000&auto=format&fit=crop'],
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      likes: 42,
      comments: 8,
      shares: 1
    }
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const extendedUser = user as unknown as ExtendedUser & typeof user;
    
    const mockProfileData = {
      coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop',
      academic: {
        major: extendedUser?.major || 'Computer Science',
        university: 'Stanford University',
        batch: '2021-2025',
      },
      traits: {
        sleepSchedule: 'Night Owl',
        cleanliness: 'Organized',
        guests: 'With Notice',
        studying: 'Library',
        substances: 'No Substances',
      },
      personality: ['Extrovert', 'Creative', 'Adventurous'],
      physicalActivity: ['Working Out', 'Running', 'Tennis'],
      pastimes: ['Video Games', 'Reading', 'Music', 'Travel'],
      food: ['Coffee', 'Pizza', 'Mexican'],
      location: {
        hometown: extendedUser?.hometown || 'California',
        country: 'USA'
      },
      contact: {
        instagram: extendedUser?.instagram || '@username',
        snapchat: extendedUser?.snapchat || '@username',
      },
      lookingForRoommate: extendedUser?.lookingForRoommate || false,
      stats: {
        profileViews: 89,
        connections: 42,
        posts: userPosts.length,
      }
    };

    const initialProfileData: ProfileData = {
      ...mockProfileData,
      name: user ? `${user.firstName} ${user.lastName}` : 'Your Name',
      profilePicture: user?.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      bio: user?.bio || 'Add a bio to tell others about yourself.',
      designation: mockProfileData.academic.major ? `${mockProfileData.academic.major} Student` : 'University Student',
      isPremium: user?.isPremium || false,
      profileCompletion: user?.isProfileCompleted ? 100 : 75,
    };

    setProfileData(initialProfileData);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, navigate, userPosts.length]);

  return {
    profileData,
    setProfileData,
    userPosts,
    isLoading,
    user
  };
}; 