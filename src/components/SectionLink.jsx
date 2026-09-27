import { Link, useLocation } from "react-router";

/**
 * Link to a home-page section (e.g. "#contact"). On the home page it's a
 * plain in-page anchor; elsewhere it routes back to "/#contact".
 */
function SectionLink({ anchor, children, ...props }) {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return (
      <a href={anchor} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={`/${anchor}`} {...props}>
      {children}
    </Link>
  );
}

export default SectionLink;
