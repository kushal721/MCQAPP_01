import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { PageLoader } from "./ui/Spinner";

// Renders children only for a signed-in admin; otherwise sends the visitor
// to the login page and remembers where they were going.
const RequireAdmin = ({ children }) => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <PageLoader label="Checking your session…" />
      </div>
    );
  }
  if (status !== "signedIn") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return children;
};

export default RequireAdmin;
