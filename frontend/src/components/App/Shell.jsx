import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function Shell({ children, onHelp, immersive = false }) {
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
          <span className="region">
            <span /> EUROPA
          </span>
          {onHelp && (
            <button className="help-button" onClick={onHelp}>
              <Icon name="info" size={17} /> Jak grać
            </button>
          )}
        </nav>
      </header>
      <main>{children}</main>
      {!immersive && (
        <footer className="site-footer">
          <span>Małe wyzwanie. Wielka podróż.</span>
          <span>45 krajów · Jeden kontynent · Twoja wiedza</span>
          <span>
            Odkrywaj. Zapamiętuj. Powtarzaj. <Icon name="globe" size={15} />
          </span>
        </footer>
      )}
    </div>
  );
}
