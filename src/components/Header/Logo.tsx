import { Image } from "@mantine/core";
import images from "../../assets/images";

interface LogoProps {
  darkMode?: boolean;
  size?: number;
}

const Logo = ({ darkMode = false, size = 112 }: LogoProps) => {
  return (
    <Image
      src={images.favicon}
      alt="Incoming Class Logo"
      width={size}
      height={size}
      style={{
        filter: darkMode ? "brightness(1.2)" : "none",
      }}
    />
  );
};

export default Logo;