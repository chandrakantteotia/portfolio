import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Project from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Credentials from "./components/Credentials";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./components/login/AdminLogin";
import { getDashboardStats } from "./components/admin/dashboard/dashboardService";

// ✅ Firebase Firestore imports
import { db } from "./firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

// ✅ Function to get public IP
const getUserIP = async () => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (error) {
    console.error("Failed to fetch IP:", error);
    return null;
  }
};

function UserLayout() {
  const [activeUsers, setActiveUsers] = useState(null);

  // ✅ Track current visitor in Firestore
  useEffect(() => {
    const registerActiveUser = async () => {
      try {
        const ip = await getUserIP();
        if (ip) {
          const userRef = doc(db, "activeUsers", ip);
          await setDoc(userRef, {
            lastSeen: serverTimestamp(),
          });
        }
      } catch (err) {
        console.error("Error registering active user:", err);
      }
    };

    registerActiveUser();
  }, []);

  // ✅ (Optional) Fetch active user count from your backend API
  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats(); // Assumes your backend returns activeUsers count
        console.log("Active Users from API:", data.activeUsers);
        setActiveUsers(data.activeUsers);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen">
        {/* All sections on one page */}
        <Hero />
        <About />
        <Project />
        <Credentials />
        <Contact />

        {/* Optional: show active users count from backend */}
        {activeUsers !== null && (
          <div className="text-center mt-4 text-gray-700 font-medium">
            Active Users (API): {activeUsers}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    localStorage.getItem("isAdminLoggedIn") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn ? "true" : "false");
  }, [isAdminLoggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserLayout />} />
        <Route
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <Navigate to="/admin/panel" />
            ) : (
              <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
            )
          }
        />
        <Route
          path="/admin/panel"
          element={
            isAdminLoggedIn ? (
              <AdminPanel onLogout={() => setIsAdminLoggedIn(false)} />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
