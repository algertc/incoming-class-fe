import React from 'react';
import { ActionIcon, rem } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';

interface ProfileCameraButtonProps {
  onClick: () => void;
  isUploading: boolean;
  hasProfilePicture: boolean;
}

const ProfileCameraButton: React.FC<ProfileCameraButtonProps> = ({
  onClick,
  isUploading,
  hasProfilePicture,
}) => {
  return (
    <ActionIcon
      variant="filled"
      radius="xl"
      size="lg"
      onClick={onClick}
      disabled={isUploading}
      styles={{
        root: {
          position: 'absolute',
          bottom: rem(8),
          right: rem(8),
          background: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          opacity: isUploading ? 0.7 : 1,
          width: rem(36),
          height: rem(36),
          '@media (max-width: 768px)': {
            width: rem(32),
            height: rem(32),
            bottom: rem(4),
            right: rem(4),
          },
          ...(!hasProfilePicture && {
            animation: 'cameraPulse 1.5s ease-in-out infinite',
          }),
        }
      }}
      title="Change profile picture"
    >
      <style>
        {`
          @keyframes cameraPulse {
            0% { 
              transform: scale(1);
              background: linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%);
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }
            50% { 
              transform: scale(1.1);
              background: linear-gradient(135deg, #3a0ca3 0%, #4361ee 100%);
              box-shadow: 0 8px 25px rgba(67, 97, 238, 0.5);
            }
            100% { 
              transform: scale(1);
              background: linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%);
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }
          }
        `}
      </style>
      <IconCamera style={{ width: rem(18), height: rem(18) }} />
    </ActionIcon>
  );
};

export default ProfileCameraButton; 