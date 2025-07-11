import * as Yup from 'yup';
import { Gender } from '../../models/user.model';

/**
 * Validation schema for the profile basic information form
 */
export const profileBasicInfoSchema = Yup.object().shape({
  instagram: Yup.string()
    .matches(/^@?[\w\\.]+$/, 'Please enter a valid Instagram handle')
    .required('Instagram handle is required'),
  // snapchat: Yup.string()
  //   .matches(/^@?[\w\\.]+$/, 'Please enter a valid Snapchat handle')
  //   .notRequired(),
  major: Yup.string()
    .required('Major is required'),
  hometown: Yup.string()
    .required('Hometown is required'),
  gender: Yup.string()
    .oneOf(Object.values(Gender), 'Please select a valid gender')
    .required('Gender is required'),
  // university: Yup.string()
  //   .required('University is required'),
  // batch: Yup.string()
  //   .required('Batch/Year is required'),
  bio: Yup.string()
    .min(20, 'Bio must be at least 20 characters')
    .max(500, 'Bio must be less than 500 characters')
    .required('Bio is required'),
  lookingForRoommate: Yup.boolean()
    .notRequired(),
});

/**
 * Validation schema for the traits and preferences form
 */
export const traitsPreferencesSchema = Yup.object().shape({
  sleepSchedule: Yup.string()
    .oneOf(['Early Bird', 'Night Owl', 'Flexible'], 'Please select a sleep schedule')
    .required('Sleep schedule is required'),
  cleanliness: Yup.string()
    .oneOf(['Very Clean', 'Average', 'Relaxed'], 'Please select a cleanliness preference')
    .required('Cleanliness preference is required'),
  guests: Yup.string()
    .oneOf(['Over Whenever', 'With Notice', 'Rarely'], 'Please select a guest preference')
    .required('Guest preference is required'),
  studying: Yup.string()
    .oneOf(['Around Campus', 'In Room', 'Library', 'Flexible'], 'Please select a studying preference')
    .required('Studying preference is required'),
  substances: Yup.string()
    .oneOf(['Fine with Drinking', 'Fine with Smoking', 'Fine with Both', 'No Substances'], 'Please select a substance preference')
    .required('Substance preference is required'),
  personality: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Select at least one personality trait')
    .required('Personality traits are required'),
  physicalActivity: Yup.array()
    .of(Yup.string())
    .notRequired(),
  pastimes: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one pastime')
    .required('Pastimes are required'),
  food: Yup.array()
    .of(Yup.string())
    .notRequired(),
  other: Yup.array()
    .of(Yup.string())
    .notRequired(),
  campusInvolvement: Yup.string()
    .notRequired(),
});

/**
 * Validation schema for the profile preview form
 * This is a simple schema since the preview doesn't have input fields,
 * but we'll use it to confirm the user has reviewed their profile
 */
export const profilePreviewSchema = Yup.object().shape({
  reviewConfirmed: Yup.boolean()
    .oneOf([true], 'You must confirm that you have reviewed your profile')
    .required('You must confirm that you have reviewed your profile'),
});

export const profileCompletionSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  designation: Yup.string().required('Designation is required'),
  hometown: Yup.string().required('Hometown is required'),
  bio: Yup.string().required('Bio is required'),
  gender: Yup.string().oneOf(Object.values(Gender), 'Please select a valid gender').optional(),
}); 