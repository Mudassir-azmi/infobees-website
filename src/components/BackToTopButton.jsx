import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-5 left-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-navy text-gold shadow-lg transition-transform hover:-translate-y-1 hover:bg-navy-light sm:bottom-6 sm:left-6"
    >
      <FaArrowUp size={16} aria-hidden="true" />
    </button>
  );
}

export default BackToTopButton;
