import React from "react";

// In-house icon set drawn in the Notion style: 20px grid, even 1.6 stroke,
// rounded caps and joins. Notion's own icons aren't licensed for use outside
// Notion, so these are original drawings that match that look.
const Icon = ({ className = "h-5 w-5", children, ...rest }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

const make = (children) => {
  const Component = (props) => <Icon {...props}>{children}</Icon>;
  return Component;
};

export const ArrowLeft = make(<path d="M16 10H4M9 5l-5 5 5 5" />);
export const ArrowRight = make(<path d="M4 10h12M11 5l5 5-5 5" />);
export const ChevronRight = make(<path d="M8 5l5 5-5 5" />);
export const Check = make(<path d="M4.5 10.5l3.5 3.5 7.5-8" />);
export const Close = make(<path d="M5 5l10 10M15 5L5 15" />);
export const Plus = make(<path d="M10 4v12M4 10h12" />);
export const Menu = make(<path d="M3.5 6h13M3.5 10h13M3.5 14h13" />);

export const Pencil = make(
  <>
    <path d="M12.5 4.5l3 3L7 16H4v-3z" />
    <path d="M11 6l3 3" />
  </>
);

export const Trash = make(
  <>
    <path d="M4 6h12" />
    <path d="M8 6V4.5h4V6" />
    <path d="M5.5 6l.8 9.6a1 1 0 001 .9h5.4a1 1 0 001-.9L14.5 6" />
  </>
);

export const Search = make(
  <>
    <circle cx="9" cy="9" r="5" />
    <path d="M13 13l3.5 3.5" />
  </>
);

export const Eye = make(
  <>
    <path d="M2.5 10S5.3 5 10 5s7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5z" />
    <circle cx="10" cy="10" r="2.2" />
  </>
);

export const EyeOff = make(
  <>
    <path d="M2.5 10S5.3 5 10 5s7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5z" />
    <circle cx="10" cy="10" r="2.2" />
    <path d="M3.5 3.5l13 13" />
  </>
);

export const Lock = make(
  <>
    <rect x="4.5" y="9" width="11" height="8" rx="2" />
    <path d="M7 9V6.5a3 3 0 016 0V9" />
  </>
);

export const Mail = make(
  <>
    <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
    <path d="M3 6l7 5 7-5" />
  </>
);

export const LogOut = make(
  <>
    <path d="M8 4H5a1 1 0 00-1 1v10a1 1 0 001 1h3" />
    <path d="M12 6.5l3.5 3.5-3.5 3.5" />
    <path d="M15.5 10H8" />
  </>
);

export const External = make(
  <>
    <path d="M11 4h5v5" />
    <path d="M16 4l-7 7" />
    <path d="M14 12v3a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h3" />
  </>
);

export const Home = make(
  <path d="M3.5 9L10 3.5 16.5 9v7a1 1 0 01-1 1H12v-4.5H8V17H4.5a1 1 0 01-1-1z" />
);

export const Refresh = make(
  <>
    <path d="M4 10a6 6 0 101.8-4.3L4 7.5" />
    <path d="M4 4v3.5h3.5" />
  </>
);

export const Warning = make(
  <>
    <path d="M10 3.5l7 12.5H3z" />
    <path d="M10 8.5V12" />
    <path d="M10 14.3v.01" />
  </>
);

export const Dashboard = make(
  <>
    <rect x="3.5" y="3.5" width="5" height="6" rx="1" />
    <rect x="11.5" y="3.5" width="5" height="4" rx="1" />
    <rect x="3.5" y="12.5" width="5" height="4" rx="1" />
    <rect x="11.5" y="10.5" width="5" height="6" rx="1" />
  </>
);

export const Books = make(
  <>
    <rect x="3" y="4" width="3.5" height="12" rx="0.8" />
    <rect x="8" y="4" width="3.5" height="12" rx="0.8" />
    <path d="M13.2 5.5l2.8-.7 2.4 10.6-2.8.7z" />
  </>
);

export const Layers = make(
  <>
    <path d="M10 3l7 3.5-7 3.5-7-3.5z" />
    <path d="M3 10l7 3.5 7-3.5" />
    <path d="M3 13.5l7 3.5 7-3.5" />
  </>
);

export const Book = make(
  <>
    <path d="M10 5.5C8.5 4.3 6 4 3 4.5v11c3-.5 5.5-.2 7 1 1.5-1.2 4-1.5 7-1v-11c-3-.5-5.5-.2-7 1z" />
    <path d="M10 5.5v11" />
  </>
);

export const Bulb = make(
  <>
    <path d="M7.5 14.5h5" />
    <path d="M8.5 17h3" />
    <path d="M10 3a5 5 0 00-3 9c.6.5 1 1.3 1 2.1v.4h4v-.4c0-.8.4-1.6 1-2.1A5 5 0 0010 3z" />
  </>
);

export const Trophy = make(
  <>
    <path d="M6.5 4h7v4a3.5 3.5 0 01-7 0z" />
    <path d="M6.5 5.5H4.2a2.5 2.5 0 002.6 3" />
    <path d="M13.5 5.5h2.3a2.5 2.5 0 01-2.6 3" />
    <path d="M10 11.5V14" />
    <path d="M7 16.5h6" />
  </>
);

export const Flame = make(
  <path d="M10 17a5 5 0 005-5c0-3-2.5-4.5-3-8-2 1.5-3.5 3.5-3.5 5.5-1-.5-1.5-1.5-1.5-2.5C5.8 8.5 5 10 5 12a5 5 0 005 5z" />
);

export const Compass = make(
  <>
    <circle cx="10" cy="10" r="7" />
    <path d="M12.8 7.2l-1.6 4-4 1.6 1.6-4z" />
  </>
);

export const QuestionPage = make(
  <>
    <path d="M5.5 3h6L15 6.5V16a1 1 0 01-1 1H5.5a1 1 0 01-1-1V4a1 1 0 011-1z" />
    <path d="M8.3 9a1.8 1.8 0 113 1.3c-.6.4-1.3.8-1.3 1.7" />
    <path d="M10 14.2v.01" />
  </>
);

export const CheckSquare = make(
  <>
    <rect x="3.5" y="3.5" width="13" height="13" rx="2.5" />
    <path d="M7 10.2l2 2 4-4.4" />
  </>
);

export const CheckCircle = make(
  <>
    <circle cx="10" cy="10" r="7" />
    <path d="M7 10.2l2 2 4-4.4" />
  </>
);

export const CrossCircle = make(
  <>
    <circle cx="10" cy="10" r="7" />
    <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" />
  </>
);

export const Shield = make(
  <>
    <path d="M10 2.8l6 2.2v4.5c0 3.8-2.6 6.4-6 7.7-3.4-1.3-6-3.9-6-7.7V5z" />
    <path d="M7.3 10l2 2 3.5-3.8" />
  </>
);

export const Loader = ({ className = "h-5 w-5" }) => (
  <Icon className={`animate-spin ${className}`}>
    <circle cx="10" cy="10" r="7" opacity="0.25" />
    <path d="M17 10a7 7 0 00-7-7" />
  </Icon>
);
