import { useQuery } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { TAuthLevel, TRoute } from "../../consts";
import { getCurrentUser } from "../../protos/turbotin-Auth_connectquery";
import Loading from "../../util/components/loading";

const { admin, none, user } = TAuthLevel;

type TProps = {
  level: TAuthLevel;
} & PropsWithChildren;

const AuthProvider = (props: TProps): JSX.Element => {
  const { level, children } = props;
  const { data, isFetching } = useQuery(getCurrentUser.useQuery());

  let isAuthenticated = false;
  switch (level) {
    case none:
      isAuthenticated = true;
      break;
    case user:
      isAuthenticated = (data?.email.length ?? 0) > 0;
      break;
    case admin:
      isAuthenticated = data?.isAdmin === true;
  }
  if (isAuthenticated) return <>{children}</>;
  else if (isFetching) return <Loading />;
  else return <Navigate to={TRoute.full_table} />;
};

export default AuthProvider;
