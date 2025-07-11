import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '../../../store/auth.store';
import { useUpdateCurrentUserProfile } from '../../../hooks/api';
import type { UpdateProfileData, User } from '../../../models/user.model';

// Edit state interface
interface EditStates {
  bio: boolean;
  academic: boolean;
  traits: boolean;
  interests: boolean;
  contact: boolean;
}

// Loading state interface
interface LoadingStates {
  bio: boolean;
  academic: boolean;
  traits: boolean;
  interests: boolean;
  contact: boolean;
}

// Data interfaces for edit operations
export interface AcademicData {
  academic: { major: string; };
  location: { hometown: string };
  lookingForRoommate: boolean;
}

export interface TraitsData {
  traits: {
    sleepSchedule: string;
    cleanliness: string;
    guests: string;
    studying: string;
    substances: string;
  };
  personality: string[];
}

export interface InterestsData {
  physicalActivity: string[];
  pastimes: string[];
  food: string[];
  campusInvolvement?: string;
}

export interface ContactData {
  instagram: string;
  snapchat: string;
}

export const useProfileEditing = (
  _profileData: User | null,
  setProfileData: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const { setUser } = useAuthStore();
  const { mutateAsync: updateProfile } = useUpdateCurrentUserProfile();
  
  // Edit states for different sections
  const [editStates, setEditStates] = useState<EditStates>({
    bio: false,
    academic: false,
    traits: false,
    interests: false,
    contact: false,
  });

  // Loading states for different sections
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    bio: false,
    academic: false,
    traits: false,
    interests: false,
    contact: false,
  });

  // Toggle edit state for different sections
  const toggleEditState = (section: keyof EditStates) => {
    setEditStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Save handlers for different sections
  const handleSaveBio = async (newBio: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, bio: true }));
      
      const updateData: UpdateProfileData = {
        bio: newBio
      };

      const response = await updateProfile(updateData);

      if (!response.status) {
        throw new Error(response.errorMessage?.message || 'Failed to update bio');
      }

      // Update local state
      setProfileData((prev: User | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          bio: newBio
        };
      });

      // Update user in auth store
      if (response.data) {
        setUser(response.data);
      }

      setEditStates(prev => ({ ...prev, bio: false }));
      notifications.show({
        title: 'Success',
        message: 'Bio updated successfully!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: (error as Error).message,
        color: 'red',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, bio: false }));
    }
  };

  const handleSaveAcademic = async (academicData: AcademicData) => {
    try {
      setLoadingStates(prev => ({ ...prev, academic: true }));
      
      const updateData: UpdateProfileData = {
        major: academicData.academic.major,
        hometown: academicData.location.hometown,
      };

      const response = await updateProfile(updateData);

      if (!response.status) {
        throw new Error(response.errorMessage?.message || 'Failed to update academic information');
      }

      // Update local state
      setProfileData((prev: User | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          major: academicData.academic.major,
          hometown: academicData.location.hometown,
        };
      });

      // Update user in auth store
      if (response.data) {
        setUser(response.data);
      }

      setEditStates(prev => ({ ...prev, academic: false }));
      notifications.show({
        title: 'Success',
        message: 'Academic information updated successfully!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: (error as Error).message,
        color: 'red',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, academic: false }));
    }
  };

  const handleSaveTraits = async (traitsData: TraitsData) => {
    try {
      setLoadingStates(prev => ({ ...prev, traits: true }));
      
      const updateData: UpdateProfileData = {
        sleepSchedule: traitsData.traits.sleepSchedule,
        cleanliness: traitsData.traits.cleanliness,
        guests: traitsData.traits.guests,
        substances: traitsData.traits.substances,
        personality: traitsData.personality,
      };

      const response = await updateProfile(updateData);

      if (!response.status) {
        throw new Error(response.errorMessage?.message || 'Failed to update traits & preferences');
      }

      // Update local state
      setProfileData((prev: User | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          sleepSchedule: traitsData.traits.sleepSchedule,
          cleanliness: traitsData.traits.cleanliness,
          guests: traitsData.traits.guests,
          substances: traitsData.traits.substances,
          personality: traitsData.personality
        };
      });

      // Update user in auth store
      if (response.data) {
        setUser(response.data);
      }

      setEditStates(prev => ({ ...prev, traits: false }));
      notifications.show({
        title: 'Success',
        message: 'Traits & preferences updated successfully!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: (error as Error).message,
        color: 'red',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, traits: false }));
    }
  };

  const handleSaveInterests = async (interestsData: InterestsData) => {
    try {
      setLoadingStates(prev => ({ ...prev, interests: true }));
      
      const updateData: UpdateProfileData = {
        physicalActivity: interestsData.physicalActivity,
        pastimes: interestsData.pastimes,
        food: interestsData.food,
        campusInvolvement: interestsData.campusInvolvement
      };

      const response = await updateProfile(updateData);

      if (!response.status) {
        throw new Error(response.errorMessage?.message || 'Failed to update interests');
      }

      // Update local state
      setProfileData((prev: User | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          physicalActivity: interestsData.physicalActivity,
          pastimes: interestsData.pastimes,
          food: interestsData.food,
          campusInvolvement: interestsData.campusInvolvement
        };
      });

      // Update user in auth store
      if (response.data) {
        setUser(response.data);
      }

      setEditStates(prev => ({ ...prev, interests: false }));
      notifications.show({
        title: 'Success',
        message: 'Interests updated successfully!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: (error as Error).message,
        color: 'red',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, interests: false }));
    }
  };

  const handleSaveContact = async (contactData: ContactData) => {
    try {
      setLoadingStates(prev => ({ ...prev, contact: true }));
      
      const updateData: UpdateProfileData = {
        instagram: contactData.instagram,
        snapchat: contactData.snapchat,
      };

      const response = await updateProfile(updateData);

      if (!response.status) {
        throw new Error(response.errorMessage?.message || 'Failed to update contact information');
      }

      // Update local state
      setProfileData((prev: User | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          instagram: contactData.instagram,
          snapchat: contactData.snapchat,
        };
      });

      // Update user in auth store
      if (response.data) {
        setUser(response.data);
      }

      setEditStates(prev => ({ ...prev, contact: false }));
      notifications.show({
        title: 'Success',
        message: 'Contact information updated successfully!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: (error as Error).message,
        color: 'red',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, contact: false }));
    }
  };

  return {
    editStates,
    setEditStates,
    loadingStates,
    toggleEditState,
    handleSaveBio,
    handleSaveAcademic,
    handleSaveTraits,
    handleSaveInterests,
    handleSaveContact,
  };
}; 