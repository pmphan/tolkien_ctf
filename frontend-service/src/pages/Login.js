import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"

import authenClient from "../clients/authenClient"
import SubmitButton from "../components/form/SubmitButton"
import Field from "../components/form/Field"
import { useUserContext } from "../context/user"

import { toast } from 'react-toastify';

export default function Login() {
  const [loginForm, setLoginForm] = useState({ email: '', password: ''})
  const navigate = useNavigate();
  const { checkTokenValid } = useUserContext();

  const onLogin = async (e) => {
    e.preventDefault();
    await authenClient
      .login(loginForm)
      .then((response) => {
        navigate("/?login");
        checkTokenValid();
        toast.success("Login successfully.");
      })
      .catch((error) => {
        toast.error("Wrong email password combination.");
      })
  };

  return (checkTokenValid()) ? (
    <Navigate to="/?login" />
  ) : (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <form onSubmit={ onLogin }>
          <Field
            name="email"
            type="email"
            label="Email address"
            value={ loginForm.email }
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} />
          <Field
            name="password"
            type="password"
            label="Password"
            value={ loginForm.password }
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}/>
          <SubmitButton html="Log in" />
        </form>
      </div>
    </div>
  );
}
