import React from "react";
import { Redirect, Route } from "wouter";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/store/authSlice";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  path,
  component: Component,
}) => {
  const token = useSelector(selectCurrentToken);

  if (!token) {
    return <Redirect to="/auth" />;
  }

  return <Route path={path} component={Component} />;
};
