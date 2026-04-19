import { useEffect, useRef } from "react";
import { useAppState } from "@/app/AppState";

export function useSectionRegistration(id: string) {
  const ref = useRef<HTMLElement | null>(null);
  const { registerSectionElement, setActiveSection } = useAppState();

  useEffect(() => {
    const element = ref.current;
    registerSectionElement(id, element);

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setActiveSection(id);
        }
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: 0.2,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      registerSectionElement(id, null);
    };
  }, [id, registerSectionElement, setActiveSection]);

  return ref;
}
