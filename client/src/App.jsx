import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./components/MainLayout";
import AboutUs from "./pages/AboutUs";
import { AuthProvider } from "./lib/AuthProvider.jsx";
import NotFound from "./pages/NotFound.jsx";
import RoomPage from "./pages/RoomPage.jsx";
import LoginSignup from "./pages/Login-Signup.jsx";
import OnBoarding from "./pages/OnBoarding.jsx";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile.jsx";
import CodingArea from "./pages/CodingArea.jsx";
import MyAmigos from "./pages/MyAmigos.jsx";
import Leaderboard from "./pages/LeaderBoard.jsx";

const App = () => {
  const isMobile = () => {
    return window.matchMedia("(max-width: 568px)").matches; 
  };

  if (isMobile()) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="px-5 text-center flex-col h-screen flex items-center font-bold justify-center">
          Sorry This app is not available for Mobile
          <br />
          <p className="italic">Try on your Laptop or PC</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="onboarding" element={<OnBoarding />} />
              <Route path="about-us" element={<AboutUs />} />
              <Route path="auth" element={<LoginSignup />} />
              <Route path="profile" element={<Profile />} />
              <Route path="leaderboard" element={<Leaderboard />} />
            </Route>
              <Route path="myamigos" element={<MyAmigos />} />
              <Route path="/room/:code" element={<CodingArea />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" reverseOrder={false} />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
