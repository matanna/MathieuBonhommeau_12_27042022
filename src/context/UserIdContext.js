import { createContext } from "react";
import PropTypes from "prop-types";

export const UserIdContext = createContext([]);

export const UserIdProvider = ({ children, value }) => {
  return (
    <UserIdContext.Provider value={value}>{children}</UserIdContext.Provider>
  );
};

UserIdProvider.propTypes = {
  value: PropTypes.string.isRequired,
};
