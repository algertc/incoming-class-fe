import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * whenever the route changes. This provides a better user experience by
 * ensuring users start at the top of each new page.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll, 'smooth' for animated
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop; 