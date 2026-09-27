import { useEffect } from "react";
import { optimizeImage } from "./cloudinary";

export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://infobees.in").replace(/\/$/, "");
export const SITE_NAME = "Infobees";
const DEFAULT_TITLE = "Infobees | Academic, Research and IT Solutions";
const DEFAULT_DESCRIPTION =
  "Infobees provides academic mentorship, research consulting, higher education guidance, software development, digital services and IT solutions.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

/** Creates or updates a single <meta>/<link> tag in <head>, so tags are never duplicated. */
function upsertTag(tagName, match, attrs) {
  const selector = `${tagName}${Object.entries(match)
    .map(([key, value]) => `[${key}="${value}"]`)
    .join("")}`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tagName);
    Object.entries(match).forEach(([key, value]) => el.setAttribute(key, value));
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function setJsonLd(data) {
  const id = "page-structured-data";
  let el = document.getElementById(id);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Sets the page's title, description, canonical URL, social preview tags and
 * (optionally) structured data. Values not given fall back to site defaults.
 *
 *   useSeo({ title: "Academic & Research", description, path: "/services/academic-research", image })
 */
export function useSeo({ title, description, path = "/", image, type = "website", noindex = false, jsonLd } = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const desc = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, " ").trim().slice(0, 300);
  const url = `${SITE_URL}${path}`;
  const img = image ? optimizeImage(image, 1200) : DEFAULT_IMAGE;
  const structured = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = fullTitle;
    upsertTag("meta", { name: "description" }, { content: desc });
    upsertTag("meta", { name: "robots" }, { content: noindex ? "noindex, nofollow" : "index, follow" });
    upsertTag("link", { rel: "canonical" }, { href: url });

    upsertTag("meta", { property: "og:type" }, { content: type });
    upsertTag("meta", { property: "og:site_name" }, { content: SITE_NAME });
    upsertTag("meta", { property: "og:title" }, { content: fullTitle });
    upsertTag("meta", { property: "og:description" }, { content: desc });
    upsertTag("meta", { property: "og:url" }, { content: url });
    upsertTag("meta", { property: "og:image" }, { content: img });

    upsertTag("meta", { name: "twitter:card" }, { content: "summary_large_image" });
    upsertTag("meta", { name: "twitter:title" }, { content: fullTitle });
    upsertTag("meta", { name: "twitter:description" }, { content: desc });
    upsertTag("meta", { name: "twitter:image" }, { content: img });

    setJsonLd(structured ? JSON.parse(structured) : null);
  }, [fullTitle, desc, url, img, type, noindex, structured]);
}
