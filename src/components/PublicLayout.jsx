import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import SiteContentProvider from "../context/SiteContentProvider";
import BackToTopButton from "./BackToTopButton";
import Footer from "./Footer";
import Navbar from "./Navbar";
import WhatsAppButton from "./WhatsAppButton";

function PublicLayout() {
  const { pathname, hash } = useLocation();

  // New page: scroll to the requested section, or to the top.
  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section has rendered.
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <SiteContentProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
        <BackToTopButton />
      </div>
    </SiteContentProvider>
  );
}

export default PublicLayout;
