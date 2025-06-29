import type { User } from '../../../models/user.model';

/**
 * Calculate profile completion percentage based on user data
 * This provides a more granular calculation than just isProfileCompleted boolean
 */
export const calculateProfileCompletion = (user: User): number => {
  if (!user) return 0;

  const fields = [
    // Basic info (40% weight)
    { field: user.firstName, weight: 5 },
    { field: user.lastName, weight: 5 },
    { field: user.bio, weight: 10 },
    { field: user.profilePicture, weight: 10 },
    { field: user.major, weight: 5 },
    { field: user.hometown, weight: 5 },

    // Photos (15% weight)
    { field: user.photos && user.photos.length > 0, weight: 15 },

    // College info (10% weight)
    { field: user.college, weight: 5 },
    { field: user.collegeGraduationYear, weight: 5 },

    // Social links (10% weight)
    { field: user.instagram, weight: 5 },
    { field: user.snapchat, weight: 5 },

    // Traits and preferences (25% weight)
    { field: user.sleepSchedule, weight: 3 },
    { field: user.cleanliness, weight: 3 },
    { field: user.guests, weight: 3 },
    { field: user.substances, weight: 3 },
    { field: user.personality && user.personality.length > 0, weight: 3 },
    { field: user.physicalActivity && user.physicalActivity.length > 0, weight: 3 },
    { field: user.pastimes && user.pastimes.length > 0, weight: 3 },
    { field: user.food && user.food.length > 0, weight: 2 },
    { field: user.campusInvolvement, weight: 2 },
  ];

  const totalWeight = fields.reduce((sum, { weight }) => sum + weight, 0);
  const completedWeight = fields.reduce((sum, { field, weight }) => {
    const isCompleted = field && field !== '' && field !== 'Not specified';
    return sum + (isCompleted ? weight : 0);
  }, 0);

  const percentage = Math.round((completedWeight / totalWeight) * 100);
  
  // Ensure we don't exceed 100% and minimum is 0%
  return Math.min(Math.max(percentage, 0), 100);
};

/**
 * Check if profile is considered complete (90% or higher)
 */
export const isProfileComplete = (user: User): boolean => {
  return calculateProfileCompletion(user) >= 90;
}; 