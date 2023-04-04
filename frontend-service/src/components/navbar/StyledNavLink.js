import { NavLink } from "react-router-dom";

export default function StyledNavLink({ to, html }) {
  let activeStyle = "text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 mx-3 sm:mx-6";
  let inactiveStyle = "border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-3 sm:mx-6";
  return <NavLink to={ to } className={({ isActive }) => isActive ? activeStyle : inactiveStyle }>{ html }</NavLink>;
}