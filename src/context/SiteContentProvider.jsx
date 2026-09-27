import { useEffect, useMemo, useState } from "react";
import { fetchSiteSections } from "../lib/sections";
import { SiteContentContext } from "./siteContent";

const CACHE_KEY = "infobees_site_sections";

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
}

/**
 * Loads every editable section in one request, shared by all pages
 * (home, service pages, footer...). The last response is cached in
 * localStorage so returning visitors see current content immediately.
 */
function SiteContentProvider({ children }) {
  const [sections, setSections] = useState(readCache);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchSiteSections()
      .then((res) => {
        setSections(res.data);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
        } catch {
          // Storage full or blocked: caching is optional.
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const value = useMemo(() => ({ sections, loaded }), [sections, loaded]);
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export default SiteContentProvider;
