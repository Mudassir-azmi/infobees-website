import { createContext, useContext } from "react";
import { sectionFallbacks } from "../data/sectionFallbacks";

/** { sections: {...} | null, loaded: boolean } — see SiteContentProvider. */
export const SiteContentContext = createContext({ sections: null, loaded: false });

/** Content for one section: live (or cached) data if available, else the static copy. */
export function useSection(key) {
  const { sections } = useContext(SiteContentContext);
  return sections?.[key] ?? sectionFallbacks[key];
}

/** Drops links whose `section` currently has no visible items (see data/site.js). */
export function useVisibleLinks(links) {
  const { sections } = useContext(SiteContentContext);
  return links.filter((link) => {
    if (!link.section) return true;
    const section = sections?.[link.section] ?? sectionFallbacks[link.section];
    return section?.items?.length > 0;
  });
}

/** True once fresh data has arrived from the API (or the request failed). */
export function useSiteContentLoaded() {
  return useContext(SiteContentContext).loaded;
}
