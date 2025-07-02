import { Image, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import images from "../../assets/images";

interface LogoProps {
  darkMode?: boolean;
  size?: number;
  mobileSize?: number;
}

const Logo = ({ darkMode = false, size, mobileSize }: LogoProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Default sizes: smaller for mobile, larger for desktop
  const defaultDesktopSize = 112;
  const defaultMobileSize = 48;
  
  // Use custom sizes if provided, otherwise use responsive defaults
  const logoSize = size || (isMobile ? (mobileSize || defaultMobileSize) : defaultDesktopSize);
  
  return (
    <Box
      style={{
        width: logoSize,
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src={images.favicon}
        alt="Incoming Class Logo"
        width="100%"
        height="auto"
        style={{
          filter: darkMode ? "brightness(1.2)" : "none",
          WebkitFilter: darkMode ? "brightness(1.2)" : "none", // Safari support
          maxWidth: '100%',
          objectFit: 'contain',
          WebkitUserSelect: 'none', // Prevent image selection on Safari
          userSelect: 'none',
        }}
      />
    </Box>
  );
};

export default Logo;