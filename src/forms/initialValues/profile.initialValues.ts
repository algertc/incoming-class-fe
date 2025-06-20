import type { User } from '../../models/user.model';

/**
 * Extended user interface that includes all profile completion fields
 */
interface ExtendedUser extends User {
  instagram?: string;
  snapchat?: string;
  major?: string;
  hometown?: string;
  university?: string;
  batch?: string;
  lookingForRoommate?: boolean;
  sleepSchedule?: string;
  cleanliness?: string;
  guests?: string;
  studying?: string;
  substances?: string;
  personality?: string[];
  physicalActivity?: string[];
  pastimes?: string[];
  food?: string[];
  other?: string[];
  college?: {
    name?: string;
    id?: string;
  };
  collegeName?: string;
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
    other?: string[];
  };
}

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
  
  const extendedUser = user as ExtendedUser;
  
  return {
    instagram: extendedUser.instagram || '',
    snapchat: extendedUser.snapchat || '',
    major: extendedUser.major || '',
    hometown: extendedUser.hometown || '',
    university: extendedUser.university || extendedUser.college?.name || extendedUser.collegeName || '',
    batch: extendedUser.batch || '',
    bio: extendedUser.bio || '',
    lookingForRoommate: extendedUser.lookingForRoommate || false
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
  
  const extendedUser = user as ExtendedUser;
  const traits = extendedUser.traits || {};
  
  return {
    sleepSchedule: extendedUser.sleepSchedule || traits.sleepSchedule || '',
    cleanliness: extendedUser.cleanliness || traits.cleanliness || '',
    guests: extendedUser.guests || traits.guests || '',
    studying: extendedUser.studying || traits.studying || '',
    substances: extendedUser.substances || traits.substances || '',
    personality: extendedUser.personality || traits.personality || [],
    physicalActivity: extendedUser.physicalActivity || traits.physicalActivity || [],
    pastimes: extendedUser.pastimes || traits.pastimes || [],
    food: extendedUser.food || traits.food || [],
    other: extendedUser.other || traits.other || []
  };
};

/**
 * Initial values for the profile preview form
 */
export const profilePreviewInitialValues = {
  reviewConfirmed: false
}; 