import { createContext, useContext, useState } from "react"
import jwtDecode from "jwt-decode"
import * as moment from "moment"

export function isValidToken() {
  const tokenString = localStorage.getItem("token")
  if (tokenString) {
    const token = JSON.parse(tokenString)
    const decodedAccessToken = jwtDecode(token.access_token)
      if(moment.unix(decodedAccessToken.exp).toDate() > new Date()){
        return true;
      } else {
        return false
      }
  };
}

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [tokenValid, setTokenValid] = useState(isValidToken());

  const checkTokenValid = () => {
    let valid = isValidToken();
    setTokenValid(valid);
    return valid;
  }

  return (
    <UserContext.Provider value={{ tokenValid, checkTokenValid, setTokenValid }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
