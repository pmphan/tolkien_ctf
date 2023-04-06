import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import authenClient from "../clients/authenClient"

export default function Profile() {
  let [user, setUser] = useState({})
  useEffect(() => {
    authenClient
      .fetchUser()
      .then((response) => {
        setUser(response);
      })
      .catch((error) => {
        toast.error("You are not allowed here.");
      });
  }, [])

  return (
    <div>
      <h1>Email: { user.email }</h1>
      <h1>Role: { user.role }</h1>
      <h1>Flag: { user.flag ? user.flag : "Log in as admin to see flag (email: adminery@admin.com)"}</h1>
    </div>
  );
}
