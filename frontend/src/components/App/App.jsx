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
        <Route path="/" element={<Game />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
