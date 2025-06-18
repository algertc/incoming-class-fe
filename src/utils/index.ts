// Export notification utilities
export * from './notifications';

// iOS Safari Performance Detection and Optimizations
export const isIOSSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|EdgiOS|FxiOS/.test(userAgent);
  
  return isIOS && isSafari;
};

export const isLowPowerMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Detect low power mode by checking animation performance
  try {
    const start = performance.now();
    const testElement = document.createElement('div');
    testElement.style.cssText = 'position: fixed; top: -100px; animation: spin 0.1s linear;';
    document.body.appendChild(testElement);
    
    // Force a reflow
    void testElement.offsetHeight;
    
    const end = performance.now();
    document.body.removeChild(testElement);
    
    // If animation takes longer than expected, likely in low power mode
    return (end - start) > 5;
  } catch {
    return false;
  }
};

export const applyIOSOptimizations = (): void => {
  if (!isIOSSafari()) return;
  
  // Reduce animation complexity for iOS Safari
  const style = document.createElement('style');
  style.textContent = `
    /* iOS Safari specific optimizations */
    * {
      -webkit-backface-visibility: hidden !important;
      backface-visibility: hidden !important;
      -webkit-transform: translate3d(0, 0, 0) !important;
      transform: translate3d(0, 0, 0) !important;
    }
    
    /* Reduce complex animations on iOS Safari */
    @keyframes optimized-fade {
      from { opacity: 0; transform: translate3d(0, 10px, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    
    /* Slower, more efficient animations for iOS */
    .star, .bg-element, .animated-element {
      animation-duration: 150% !important;
      will-change: transform, opacity !important;
    }
    
    /* Disable expensive filters on iOS Safari */
    .bg-element {
      filter: none !important;
    }
  `;
  
  document.head.appendChild(style);
  
  // Log optimization applied
  console.log('🚀 iOS Safari optimizations applied');
};

export const optimizeScrolling = (): void => {
  if (typeof window === 'undefined') return;
  
  // Add smooth scrolling optimizations
  document.documentElement.style.cssText += `
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
  `;
  
  // Throttle scroll events for better performance
  let scrollTimeout: number;
  const optimizedScrollHandler = () => {
    document.body.style.pointerEvents = 'none';
    clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 150);
  };
  
  window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void): void => {
  if (typeof performance === 'undefined') {
    fn();
    return;
  }
  
  const start = performance.now();
  fn();
  const end = performance.now();
  
  console.log(`⚡ ${name} took ${(end - start).toFixed(2)}ms`);
};

// Device capabilities detection
export const getDeviceCapabilities = () => {
  return {
    isIOSSafari: isIOSSafari(),
    isLowPowerMode: isLowPowerMode(),
    supportsWebGL: !!window.WebGLRenderingContext,
    devicePixelRatio: window.devicePixelRatio || 1,
    hardwareConcurrency: navigator.hardwareConcurrency || 2,
    maxTouchPoints: navigator.maxTouchPoints || 0,
  };
}; 