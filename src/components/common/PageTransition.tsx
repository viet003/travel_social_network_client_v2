import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const previousPathRef = useRef(location.pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    console.log('PageTransition effect triggered:', {
      currentPath: location.pathname,
      previousPath: previousPathRef.current,
      isInitialMount: isInitialMount.current
    });

    // Skip animation on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setDisplayChildren(children);
      return;
    }

    // Only trigger animation if path actually changed
    if (location.pathname !== previousPathRef.current) {
      console.log('Path changed, starting animation');
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, update children and fade in
      const timer = setTimeout(() => {
        console.log('Animation complete, updating children');
        setDisplayChildren(children);
        setIsVisible(true);
        previousPathRef.current = location.pathname;
      }, 200);

      return () => clearTimeout(timer);
    } else {
      // If path didn't change but children did, update without animation
      console.log('Path same, updating children without animation');
      setDisplayChildren(children);
    }
  }, [location.pathname, children]);

  console.log('PageTransition render:', { isVisible, path: location.pathname });

  return (
    <div
      className={`transition-all duration-300 ease-in-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-3 scale-95'
      }`}
      style={{
        willChange: 'opacity, transform',
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
