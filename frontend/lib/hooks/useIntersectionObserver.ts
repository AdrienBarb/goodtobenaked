import { RefObject, useEffect } from "react";

interface IntersectionObserverProps {
  target: RefObject<Element>;
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

export const useIntersectionObserver = ({
  target,
  onIntersect,
  enabled = true,
  threshold = 1.0,
  root = null,
  rootMargin = "0px",
}: IntersectionObserverProps) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

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
