import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "../components/icons";

const NotFound = ({ admin }) => (
  <div className="container-page flex flex-col items-center py-24 text-center">
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-paper-sunk text-ink-700">
      <Compass className="h-7 w-7" />
    </div>
    <p className="eyebrow">Error 404</p>
    <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">
      Page not found
    </h1>
    <p className="mt-2 text-ink-500">
      The page you're looking for doesn't exist or has moved.
    </p>
    <Link to={admin ? "/admin" : "/"} className="btn-primary mt-8">
      {admin ? "Back to dashboard" : "Back to home"}
    </Link>
  </div>
);

export default NotFound;
