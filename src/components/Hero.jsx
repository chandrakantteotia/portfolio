import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase"; 
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const Hero = () => {
  // Scroll to section helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [homeImage, setHomeImage] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchHomeImage = async () => {
      try {
        const docRef = doc(db, "aboutSection", "content");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHomeImage(data.homeImage || null);
        } else {
          console.warn("No home image found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching home image:", error);
      } finally {
        setLoading(false); // Done loading regardless of success/failure
      }
    };

    fetchHomeImage();
  }, []);

  return (
    <section id="hero" className="min-h-[90vh] md:min-h-[105vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 sm:px-6 pt-12 sm:pt-0 relative overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 blur-sm sm:blur-none z-0 bg-white/20"></div>

      {/* Main Content */}
      <div className="text-center max-w-3xl z-10">
        {/* Loader while fetching */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <FaSpinner className="animate-spin text-5xl text-blue-500 mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Profile Image with animation */}
            {homeImage && (
              <div className="relative flex justify-center items-center mb-6">
                <motion.div
                  className="absolute w-72 h-72 rounded-full border-4 border-blue-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.5, 0], scale: [0.8, 1.4] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                />
                <motion.div
                  className="absolute w-80 h-80 rounded-full border-4 border-blue-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.5, 0], scale: [0.8, 1.6] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 1 }}
                />
                <motion.img
                  src={homeImage}
                  alt="Hero"
                  className="w-56 h-56 object-cover rounded-full border-4 border-blue-500 shadow-lg z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            )}

            {/* Heading */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 flex justify-center items-center gap-2 flex-nowrap"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Hi
              <motion.span
                role="img"
                aria-label="wave"
                className="inline-block origin-bottom"
                animate={{ rotate: [0, 20, -10, 20, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 2,
                  duration: 1,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                👋🏻
              </motion.span>
              , I'm <span className="text-blue-600">Chandrakant</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              I'm a passionate developer focused on crafting clean and user-friendly web applications. Explore my work and get in touch!
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                onClick={() => scrollToSection("projects")}
              >
                View Projects
              </button>
              <button
                type="button"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-50 transition"
                onClick={() => scrollToSection("contact")}
              >
                Contact Me
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
