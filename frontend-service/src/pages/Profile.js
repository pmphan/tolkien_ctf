import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { useUserContext } from "../context/user.js"
import authenClient from "../clients/authenClient"

import H1 from "../components/layout/H1"

export default function Profile() {
  let [user, setUser] = useState({})
  let { checkTokenValid } = useUserContext();
  const adminAva = "https://static.wikia.nocookie.net/lotr/images/8/8b/DOiAi2WUEAE3A1Y.0.jpg";
  const userAva = "https://tolkiengateway.net/w/images/8/8b/Larry_Forcella_-_Lesser_ring.jpg";
  const navigate = useNavigate();
  useEffect(() => {
    authenClient
      .fetchUser()
      .then((response) => {
        setUser(response);
      })
      .catch((error) => {
        navigate("/?profile");
        checkTokenValid();
        toast.error(error.response.data.detail || "Something went wrong.");
      });
  }, [navigate, checkTokenValid])

  return <>
    <H1 html="Profile" />
    <div className="justify-center mb-2 mt-0 px-5 sm:flex sm:space-x-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex-shrink-0 w-full mb-6 h-44 sm:h-60 sm:w-60 sm:mb-0">
        <img src={ user.role ? userAva : adminAva } alt="Profile pic" className="object-cover object-center w-full h-full rounded dark:bg-gray-500" />
      </div>
      <div className="flex flex-col space-y-4 text-left">
        <div>
          <h2 className="text-2xl">{ user.first_name } { user.last_name }</h2>
          <span className="text-sm dark:text-gray-400">{ user.role ? "Standard User" : "Administrator" }</span>
        </div>
        <div className="space-y-1">
          <span className="flex space-x-2">
            <strong>Email: </strong>
            <p className="dark:text-gray-400">{ user.email }</p>
          </span>
          <span className="flex space-x-2">
            <strong>Flag: </strong>
            <p className="dark:text-gray-400">{ user.flag ? user.flag : "Log in as admin to see flag (email: adminery@admin.com)" }</p>
          </span>
        </div>
      </div>
    </div>
  </>;
}
