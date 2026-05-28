import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Reset window scroll
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });

    // Also target container layouts inside our standard SPA template
    const scrollContainers = document.querySelectorAll(
      ".overflow-y-auto, main, #root, body, html"
    );
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, [pathname, search]);

  return null;
}
