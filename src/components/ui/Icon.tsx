export type IconName =
  | "sun"
  | "moon"
  | "plus"
  | "edit"
  | "trash"
  | "download"
  | "upload"
  | "search"
  | "close"
  | "alert"
  | "trophy"
  | "tag"
  | "target"
  | "trendUp"
  | "trendDown"
  | "menu"
  | "chart"
  | "wallet"
  | "check"
  | "logout"
  | "user"
  | "book"
  | "bell"
  | "sparkles"
  | "send"
  | "chevronDown"
  | "arrowRight"
  | "shield"
  | "eye"
  | "eyeOff"
  | "star"
  | "home"
  | "camera"
  | "palette"
  | "lock"
  | "monitor"
  | "creditCard";

const PATHS: Record<IconName, string> = {
  sun: "M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-6.66 1.42-1.42M4.92 19.08l1.42-1.42M19.08 19.08l-1.42-1.42M4.92 4.92 6.34 6.34M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z",
  download: "M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  upload: "M12 21V9m0 0-4 4m4-4 4 4M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35",
  close: "M18 6 6 18M6 6l12 12",
  alert: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  trophy: "M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4ZM7 4H4a3 3 0 0 0 3 3M17 4h3a3 3 0 0 1-3 3",
  tag: "m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82ZM7 7h.01",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  trendUp: "M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6",
  trendDown: "M22 17 13.5 8.5 8.5 13.5 2 7M16 17h6v-6",
  menu: "M4 6h16M4 12h16M4 18h16",
  chart: "M3 3v18h18M18 17V9M13 17V5M8 17v-4",
  wallet: "M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-4a2 2 0 0 1 0-4h4Z",
  check: "M20 6 9 17l-5-5",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  user: "M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z",
  bell: "M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9ZM13.73 21a2 2 0 0 1-3.46 0",
  sparkles: "M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2",
  send: "m22 2-7 20-4-9-9-4Z M22 2 11 13",
  chevronDown: "m6 9 6 6 6-6",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  eyeOff:
    "M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a17.4 17.4 0 0 1-3.15 4.31M6.5 6.5C3.6 8.3 1 12 1 12s4 8 11 8a9.26 9.26 0 0 0 4.15-.94M9.9 9.9a3 3 0 1 0 4.2 4.2M2 2l20 20",
  star: "m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z",
  home: "M3 9.5 12 2l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  camera:
    "M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z M12 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  palette:
    "M12 22a10 10 0 1 1 0-20 9 9 0 0 1 9 9c0 2-1.5 3-3.5 3H15a2 2 0 0 0-1.6 3.2c.5.6.1 1.6-.7 1.7-.2 0-.5.1-.7.1ZM6.5 11a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9.5 7a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 9.5 7ZM14.5 7a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM17.5 11a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z",
  lock: "M6 11V8a6 6 0 0 1 12 0v3m-14 0h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9Z M12 15v3",
  monitor: "M3 4h18v12H3V4Zm5 16h8m-4-4v4",
  creditCard: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z M2 10h20",
};

export default function Icon({
  name,
  size = 20,
  className = "",
  filled = false,
}: {
  name: IconName;
  size?: number;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
