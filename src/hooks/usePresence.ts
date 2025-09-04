import { useEffect, useState } from 'react';

export const usePresence = () => {
  const [isPresent, setIsPresent] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPresent(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isPresent;
};
