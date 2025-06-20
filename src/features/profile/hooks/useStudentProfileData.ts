import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { usersService } from '../../../services';
import { notifications } from '@mantine/notifications';
import type { Post } from '../../feed/components/PostCard';
import type { User } from '../../../models/user.model';



export const useStudentProfileData = () => {
  const { id } = useParams<{ id: string }>();
  console.log("is id", id);
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<User | null>(null);
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

        const user = response.data as User;

        // Use the user data directly as profileData
        setProfileData(user);

        // Generate mock posts for the student
        const mockPosts: Post[] = [
          {
            id: `student-post-1-${id}`,
            author: {
              id: user.id || user._id || '',
              name: user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.email,
              avatar: user.profilePicture || 'https://i.pravatar.cc/150?img=20',
              verified: user.isPremium || false
            },
            content: 'Looking forward to meeting new people this semester! Anyone interested in study groups for computer science courses?',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
            likes: 15,
            comments: 4,
            shares: 1,
            isLiked: false,
          },
          {
            id: `student-post-2-${id}`,
            author: {
              id: user.id || user._id || '',
              name: user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.email,
              avatar: user.profilePicture || 'https://i.pravatar.cc/150?img=20',
              verified: user.isPremium || false
            },
            content: 'Just joined the campus hiking club! Great way to explore the area and meet fellow outdoor enthusiasts.',
            images: user.photos && user.photos.length > 0 ? [user.photos[0]] : undefined,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            likes: 23,
            comments: 7,
            shares: 2,
            isLiked: false,
          }
        ];

        setStudentPosts(mockPosts);

      } catch (error) {
        console.error('Error fetching student profile:', error);
        setError((error as Error).message);
        notifications.show({
          title: 'Error',
          message: 'Failed to load student profile. Please try again.',
          color: 'red',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id, navigate]);

  return {
    profileData,
    setProfileData,
    studentPosts,
    isLoading,
    error
  };
}; 