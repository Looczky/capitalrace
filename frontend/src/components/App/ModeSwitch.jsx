import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ModeSwitch() {
  const { pathname } = useLocation();
  const isCountries = pathname.startsWith("/countries");
  return (
    <nav className="mode-switch" aria-label="Wybierz minigrę">
      <Link
        to="/"
        className={!isCountries ? "active" : ""}
        aria-current={!isCountries ? "page" : undefined}
      >
        Stolice
      </Link>
      <Link
        to="/countries"
        className={isCountries ? "active" : ""}
        aria-current={isCountries ? "page" : undefined}
      >
        Państwa
      </Link>
    </nav>
  );
}
