import { Image } from "@mantine/core";
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
    <Image
      src={images.favicon}
      alt="Incoming Class Logo"
      width={logoSize}
      height={logoSize}
      style={{
        filter: darkMode ? "brightness(1.2)" : "none",
      }}
    />
  );
};

export default Logo;