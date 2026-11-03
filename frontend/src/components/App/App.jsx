import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Game from "../Game/Game";
import Results from "../Results/Results";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Game key="capitals" />} />
        <Route
          path="/countries"
          element={<Game key="countries" mode="countries" />}
        />
        <Route path="/results" element={<Results key="capitals-results" />} />
        <Route
          path="/countries/results"
          element={<Results key="countries-results" mode="countries" />}
        />
        <Route path="*" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
