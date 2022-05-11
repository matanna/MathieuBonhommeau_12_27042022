import { createContext } from "react";
import PropTypes from "prop-types";

/**
 * Context used for the userId
 * @type {React.Context}
 */
export const UserIdContext = createContext([]);

/**
 * Provider for provide the context on all elements
 * @param children All the children of the components / This provider is placed on Profil component
 * @param value For adapt the context value when is necessary / the id of the user is placed in the context when the param url change and all children elements can retrieve it
 * @returns {JSX.Element}
 * @constructor
 */
export const UserIdProvider = ({ children, value }) => {
  return (
    <UserIdContext.Provider value={value}>{children}</UserIdContext.Provider>
  );
};

UserIdProvider.propTypes = {
  value: PropTypes.string.isRequired,
};
