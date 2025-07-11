import type { User } from '../../models/user.model';

/**
 * Initial values for the profile basic information form
 */
export const profileBasicInfoInitialValues = {
  instagram: '',
  snapchat: '',
  major: '',
  hometown: '',
  gender: '',
  bio: '',
  lookingForRoommate: false
};

/**
 * Get pre-filled basic info values from user data
 */
export const getProfileBasicInfoInitialValues = (user?: User | null) => {
  if (!user) return profileBasicInfoInitialValues;
  
  return {
    instagram: user.instagram || '',
    snapchat: user.snapchat || '',
    major: user.major || '',
    hometown: user.hometown || '',
    gender: user.gender || '',
    bio: user.bio || '',
    lookingForRoommate: false
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
  other: [] as string[],
  campusInvolvement: ''
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
    studying: user.studying || '',
    substances: user.substances || '',
    personality: user.personality || [],
    physicalActivity: user.physicalActivity || [],
    pastimes: user.pastimes || [],
    food: user.food || [],
    other: user.other || [],
    campusInvolvement: user.campusInvolvement || ''
  };
};

/**
 * Initial values for the profile preview form
 */
export const profilePreviewInitialValues = {
  reviewConfirmed: false
}; 