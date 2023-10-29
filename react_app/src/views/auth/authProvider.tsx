import { useQuery } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { TAuthLevel, TRoute } from "../../consts";
import { getCurrentUser } from "../../protos/turbotin-Auth_connectquery";
import { User } from "../../protos/turbotin_pb";
import Loading from "../../util/components/loading";

type TProps = {
  level: TAuthLevel;
} & PropsWithChildren;

export const isAuthenticated = (level: TAuthLevel, user?: User): boolean => {
  switch (level) {
    case TAuthLevel.none:
      return true;
    case TAuthLevel.user:
      return (user?.email.length ?? 0) > 0;
    case TAuthLevel.admin:
      return user?.isAdmin === true;
  }
};

const AuthProvider = (props: TProps): JSX.Element => {
  const { level, children } = props;
  const { data: user, isFetching } = useQuery(getCurrentUser.useQuery());

  if (isAuthenticated(level, user)) return <>{children}</>;
  else if (isFetching) return <Loading />;
  else return <Navigate to={TRoute.full_table} />;
};

export default AuthProvider;
