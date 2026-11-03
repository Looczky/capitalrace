import React from "react";
import { useNavigate } from "react-router-dom";
import { REGIONS, getGamePath } from "../../data/regions";
import Icon from "./Icon";

export default function RegionSelect({
  regionId = "europe",
  mode = "capitals",
}) {
  const navigate = useNavigate();
  return (
    <label className="region-select">
      <Icon name="globe" size={15} />
      <span className="sr-only">Region</span>
      <select
        aria-label="Region"
        value={regionId}
        onChange={(event) => navigate(getGamePath(event.target.value, mode))}
      >
        {Object.values(REGIONS).map((region) => (
          <option key={region.id} value={region.id}>
            {region.label}
          </option>
        ))}
      </select>
    </label>
  );
}
