import StyledNavLink from "./StyledNavLink"
import authenClient from "../../clients/authenClient"
import { useUserContext } from "../../context/user"

export default function UserStatusBar({ history }) {
  const { tokenValid, setTokenValid } = useUserContext();
  const onLogout = () => {
    authenClient.logout();
    setTokenValid(false);
  }
  return (!tokenValid) ? (
    <>
      <li><StyledNavLink to="/login" html="Log In" /></li>
      <li><StyledNavLink to="/signup" html="Sign Up" /></li>
    </>
  ) : (
    <>
      <li><button onClick={ onLogout } className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Log Out</button></li>
    </>
  )
}
