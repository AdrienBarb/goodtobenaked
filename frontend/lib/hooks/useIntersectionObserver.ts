import { useEffect } from "react";

export const useIntersectionObserver = ({
  target,
  onIntersect,
  enabled = true,
  threshold = 1.0,
  root = null,
  rootMargin = "0px",
}) => {
  useEffect(() => {
    console.log("enable ", enabled);

    if (!enabled) {
      return;
    }

    console.log("jepasse");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    const element = target.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [enabled, root, rootMargin, onIntersect, target, threshold]);
};
