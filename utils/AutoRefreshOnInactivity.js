import { useEffect, useRef } from 'react';

const AutoRefreshOnInactivity = ({ minutes }) => {
  const timeoutRef = useRef(null);
  const inactiveAtRef = useRef(null);
  const threshold = minutes * 60 * 1000;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is inactive
        inactiveAtRef.current = Date.now();

        timeoutRef.current = setTimeout(() => {
          // Timer expired; actual reload logic is in visibility return
        }, threshold);
      } else {
        // Tab becomes active again
        if (inactiveAtRef.current) {
          const timeAway = Date.now() - inactiveAtRef.current;
          inactiveAtRef.current = null;

          if (timeAway >= threshold) {
            window.location.reload();
          }
        }

        // Clear timer if coming back early
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [threshold]);

  return null;
};

export default AutoRefreshOnInactivity;
