import { createElement } from "react";
import { resolveIcon } from "../lib/icons";

/** Renders an icon from its stored name (e.g. "FaGlobe") or an icon component. */
function DynamicIcon({ icon, ...props }) {
  return createElement(resolveIcon(icon), props);
}

export default DynamicIcon;
