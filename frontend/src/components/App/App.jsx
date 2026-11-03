import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import Game from "../Game/Game";
import Results from "../Results/Results";
import "./App.css";
import { getRegion } from "../../data/regions";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RegionRoute({ mode = "capitals", results = false }) {
  const { regionId } = useParams();
  if (!getRegion(regionId)) return <Navigate to="/" replace />;
  return results ? (
    <Results
      key={`${regionId}-${mode}-results`}
      regionId={regionId}
      mode={mode}
    />
  ) : (
    <Game key={`${regionId}-${mode}`} regionId={regionId} mode={mode} />
  );
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
        <Route path="/play/:regionId" element={<RegionRoute />} />
        <Route
          path="/play/:regionId/countries"
          element={<RegionRoute mode="countries" />}
        />
        <Route
          path="/play/:regionId/results"
          element={<RegionRoute results />}
        />
        <Route
          path="/play/:regionId/countries/results"
          element={<RegionRoute mode="countries" results />}
        />
        <Route path="*" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
