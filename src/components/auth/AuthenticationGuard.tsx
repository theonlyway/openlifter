import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";

type AuthenticationGuard = {
  component: React.ComponentType;
};

const AuthenticationGuard = ({ component }: AuthenticationGuard) => {
  const Component = withAuthenticationRequired(component, {
    returnTo: "/",
  });

  return <Component />;
};

export default AuthenticationGuard;
