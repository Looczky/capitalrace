import React from "react";

export default function CountryFlag({ country }) {
  return (
    <img
      className="country-flag"
      src={`${process.env.PUBLIC_URL}/flags/${country.code}.svg`}
      alt=""
      width="32"
      height="24"
    />
  );
}
