import * as Yup from 'yup';

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
    .required('Sleep schedule is required'),
  cleanliness: Yup.string()
    .required('Cleanliness preference is required'),
  guests: Yup.string()
    .required('Guest preference is required'),
  studying: Yup.string()
    .required('Studying preference is required'),
  substances: Yup.string()
    .required('Substance preference is required'),
  personality: Yup.array()
    .of(Yup.string())
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