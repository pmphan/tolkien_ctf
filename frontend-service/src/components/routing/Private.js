import { useUserContext } from "../../context/user"
import { toast } from "react-toastify";
import { Navigate } from 'react-router-dom';

export const Private = ({ Component }) => {
    const { checkTokenValid } = useUserContext();
    const auth = checkTokenValid();
    if (auth) {
      return <Component />
    }
    toast.info("Please login.");
    return <Navigate to="/login" />
}
