import { createContext } from "react";
import { UserDetails } from "../service";

export const UserContext = createContext<UserDetails | null>(null);
