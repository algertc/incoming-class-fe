import type { User } from '../../models/user.model';

/**
 * Initial values for the profile basic information form
 */
export const profileBasicInfoInitialValues = {
  instagram: '',
  snapchat: '',
  major: '',
  hometown: '',
  university: '',
  batch: '',
  bio: '',
  lookingForRoommate: false
};

/**
 * Get pre-filled basic info values from user data
 */
export const getProfileBasicInfoInitialValues = (user?: User | null) => {
  if (!user) return profileBasicInfoInitialValues;
  
  const collegeName = typeof user.college === 'object' && user.college 
    ? user.college.name 
    : '';
  
  return {
    instagram: user.instagram || '',
    snapchat: user.snapchat || '',
    major: user.major || '',
    hometown: user.hometown || '',
    university: user.university || collegeName || '',
    batch: user.collegeGraduationYear || '',
    bio: user.bio || '',
    lookingForRoommate: false // This field doesn't exist in User model
  };
};

/**
 * Initial values for the traits and preferences form
 */
export const traitsPreferencesInitialValues = {
  sleepSchedule: '',
  cleanliness: '',
  guests: '',
  studying: '',
  substances: '',
  personality: [] as string[],
  physicalActivity: [] as string[],
  pastimes: [] as string[],
  food: [] as string[],
  other: [] as string[]
};

/**
 * Get pre-filled traits and preferences values from user data
 */
export const getTraitsPreferencesInitialValues = (user?: User | null) => {
  if (!user) return traitsPreferencesInitialValues;
  
  return {
    sleepSchedule: user.sleepSchedule || '',
    cleanliness: user.cleanliness || '',
    guests: user.guests || '',
    studying: '', // This field doesn't exist in User model
    substances: user.substances || '',
    personality: user.personality || [],
    physicalActivity: user.physicalActivity || [],
    pastimes: user.pastimes || [],
    food: user.food || [],
    other: user.other || []
  };
};

/**
 * Initial values for the profile preview form
 */
export const profilePreviewInitialValues = {
  reviewConfirmed: false
}; 