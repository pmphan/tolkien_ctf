import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import UserProvider from "./context/user";
import Navbar from "./components/navbar/Navbar"
import { Private } from "./components/routing/Private"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"

import './App.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={ <Home/> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/signup" element={ <Signup /> } />
            <Route path="/profile" element={ <Private Component={Profile} /> } />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
