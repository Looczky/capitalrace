import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import RegionSelect from "./RegionSelect";
import { getRegion } from "../../data/regions";
export default function Shell({
  children,
  onHelp,
  immersive = false,
  regionId = "europe",
  mode = "capitals",
}) {
  const region = getRegion(regionId);
  return (
    <div className={`app-shell${immersive ? " atlas-shell" : ""}`}>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Capitalrace — strona główna">
          <span className="brand-icon">
            <Icon name="globe" size={25} />
          </span>
          capital<span className="brand-light">race</span>
          <span className="brand-dot">.</span>
        </Link>
        <nav aria-label="Nawigacja">
          <RegionSelect regionId={regionId} mode={mode} />
          {onHelp && (
            <button
              className="help-button"
              aria-label="Jak grać"
              onClick={onHelp}
            >
              <Icon name="info" size={17} />{" "}
              <span className="help-label">Jak grać</span>
            </button>
          )}
        </nav>
      </header>
      <main>{children}</main>
      {!immersive && (
        <footer className="site-footer">
          <span>Małe wyzwanie. Wielka podróż.</span>
          <span>
            {region.countries.length} państw · {region.label} · Twoja wiedza
          </span>
          <span>
            Odkrywaj. Zapamiętuj. Powtarzaj. <Icon name="globe" size={15} />
          </span>
        </footer>
      )}
    </div>
  );
}
