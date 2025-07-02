import { useState, useEffect } from "react";

const useInViewport = (options = {}) => {
  const [isInViewport, setIsInViewport] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { ...options }
    );

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return [isInViewport, setRef];
};

export default useInViewport;
