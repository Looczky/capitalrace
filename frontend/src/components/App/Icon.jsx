import React from "react";
const paths = {
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  frame: (
    <>
      <path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  hand: (
    <>
      <path d="M8 12V6a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v8c0 4-2 6-6 6h-2c-2 0-3-1-4-3l-4-6a2 2 0 0 1 3-2l2 2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18M5 6.5h14M5 17.5h14" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  skip: (
    <>
      <path d="m5 5 9 7-9 7V5Z" />
      <path d="M19 5v14" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  flag: <path d="M5 21V4c5-4 9 4 14 0v10c-5 4-9-4-14 0" />,
  pin: (
    <>
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  restart: <path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7v1" />
    </>
  ),
};
export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.globe}
    </svg>
  );
}
