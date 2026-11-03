import React from "react";
import { Link, useLocation } from "react-router-dom";

import { getGamePath } from "../../data/regions";

export default function ModeSwitch({ regionId = "europe" }) {
  const { pathname } = useLocation();
  const isCountries = pathname.split("/").includes("countries");
  return (
    <nav className="mode-switch" aria-label="Wybierz minigrę">
      <Link
        to={getGamePath(regionId, "capitals")}
        className={!isCountries ? "active" : ""}
        aria-current={!isCountries ? "page" : undefined}
      >
        Stolice
      </Link>
      <Link
        to={getGamePath(regionId, "countries")}
        className={isCountries ? "active" : ""}
        aria-current={isCountries ? "page" : undefined}
      >
        Państwa
      </Link>
    </nav>
  );
}
