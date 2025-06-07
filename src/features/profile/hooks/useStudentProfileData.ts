import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { usersService } from '../../../services';
import { notifications } from '@mantine/notifications';
import type { Post } from '../../feed/components/PostCard';
import type { ProfileData } from './useProfileData';
import type { User } from '../../../models/user.model';

// Extended user interface for profile data that might come from API
interface ExtendedUser extends User {
  major?: string;
  hometown?: string;
  university?: string;
  batch?: string;
  instagram?: string;
  snapchat?: string;
  lookingForRoommate?: boolean;
  traits?: {
    sleepSchedule?: string;
    cleanliness?: string;
    guests?: string;
    studying?: string;
    substances?: string;
    personality?: string[];
    physicalActivity?: string[];
    pastimes?: string[];
    food?: string[];
  };
}

export const useStudentProfileData = () => {
  const { id } = useParams<{ id: string }>();
  console.log("is id", id);
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [studentPosts, setStudentPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch user data using the specific API endpoint
        const response = await usersService.fetchUserById(id);

        if (!response.status || !response.data) {
          throw new Error('Failed to fetch student profile');
        }

        const user = response.data as ExtendedUser;

        // Transform API user data to ProfileData format
        const transformedProfileData: ProfileData = {
          coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop',
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
          profilePicture: user.profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
          bio: user.bio || 'This student has not added a bio yet.',
          designation: user.major ? `${user.major} Student` : 'University Student',
          isPremium: user.isPremium || false,
          profileCompletion: user.isProfileCompleted ? 100 : 75,
          academic: {
            major: user.major || 'Not specified',
            university: user.university || 'University',
            batch: user.batch || 'Not specified',
          },
          traits: {
            sleepSchedule: user.traits?.sleepSchedule || 'Not specified',
            cleanliness: user.traits?.cleanliness || 'Not specified',
            guests: user.traits?.guests || 'Not specified',
            studying: user.traits?.studying || 'Not specified',
            substances: user.traits?.substances || 'Not specified',
          },
          personality: user.traits?.personality || [],
          physicalActivity: user.traits?.physicalActivity || [],
          pastimes: user.traits?.pastimes || [],
          food: user.traits?.food || [],
          location: {
            hometown: user.hometown || 'Not specified',
            country: 'USA'
          },
          contact: {
            instagram: user.instagram || '@username',
            snapchat: user.snapchat || '@username',
          },
          lookingForRoommate: user.lookingForRoommate || false,
          stats: {
            profileViews: Math.floor(Math.random() * 200) + 50,
            connections: Math.floor(Math.random() * 100) + 20,
            posts: Math.floor(Math.random() * 10) + 1,
          }
        };

        setProfileData(transformedProfileData);

        // Generate mock posts for the student
        const mockPosts: Post[] = Array.from({ length: transformedProfileData.stats.posts }, (_, index) => ({
          id: `student-post-${index + 1}`,
          author: {
            id: user.id,
            name: transformedProfileData.name,
            avatar: transformedProfileData.profilePicture,
            verified: transformedProfileData.isPremium
          },
          content: [
            'Just finished my final project! This semester has been challenging but rewarding.',
            'Looking for study partners for the upcoming finals. Anyone interested?',
            'Had an amazing time at the campus event today. Great networking opportunities!',
            'Working on a new research project. Excited to share the results soon.',
            'Anyone else finding this course challenging? Let\'s form a study group!'
          ][index % 5],
          timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
          likes: Math.floor(Math.random() * 50) + 5,
          comments: Math.floor(Math.random() * 15) + 1,
          shares: Math.floor(Math.random() * 5),
          isLiked: Math.random() > 0.5,
          ...(Math.random() > 0.7 && {
            images: [`https://images.unsplash.com/photo-${1434030216411 + index}?q=80&w=1000&auto=format&fit=crop`]
          })
        }));

        setStudentPosts(mockPosts);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load student profile';
        setError(errorMessage);
        
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
        
        // Navigate back to home if user not found
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id, navigate]);

  return {
    profileData,
    studentPosts,
    isLoading,
    error,
    userId: id
  };
}; 