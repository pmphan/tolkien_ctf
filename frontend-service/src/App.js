import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import UserProvider from "./context/user";
import Navbar from "./components/navbar/Navbar"
import { Private } from "./components/routing/Private"
import Home from "./pages/Home"
import Hints from "./pages/Hints"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import Riddle from "./pages/Riddle"
import PageNotFound from "./pages/PageNotFound.js"

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="text-center">
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route exact path="/" element={ <Home/> } />
            <Route exact path="/hints" element={ <Hints/> } />
            <Route exact path="/login" element={ <Login /> } />
            <Route exact path="/signup" element={ <Signup /> } />
            <Route exact path="/profile" element={ <Private Component={Profile} /> } />
            <Route exact path="/riddle" element={ <Private Component={Riddle} /> } />
            <Route path="*" element={ <PageNotFound /> } />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
