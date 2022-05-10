import { createContext } from "react";

export const UserIdContext = createContext([]);

export const UserIdProvider = ({ children, value }) => {
  return (
    <UserIdContext.Provider value={value}>{children}</UserIdContext.Provider>
  );
};
