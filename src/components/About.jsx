import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Your MiniSpinner loader component
const MiniSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const About = () => {
  const [aboutText, setAboutText] = useState("");
  const [aboutImage, setAboutImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("Resume.pdf");
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true); // 🔄 Loading Firestore data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "aboutSection", "content");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAboutText(data.text || "");
          setAboutImage(data.aboutImage || null);
          setResumeFile(data.resumeFile || null);
          setResumeFileName(data.resumeFileName || "Resume.pdf");
        } else {
          console.warn("No about data found.");
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        toast.error("❌ Failed to fetch about section.");
      } finally {
        setLoading(false); // 🔄 Done loading
      }
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    if (!resumeFile) {
      toast.error("❌ No resume uploaded yet.");
      return;
    }

    setDownloading(true);
    try {
      const response = await fetch(resumeFile, { mode: "cors" });
      if (!response.ok) {
        throw new Error("File download failed");
      }

      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = resumeFileName || "Resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobURL);

      toast.success("✅ Resume downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("❌ Failed to download resume.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="about" className="min-h-screen px-6 py-17 bg-white flex flex-col items-center justify-center">
      {loading ? (
        // Use your MiniSpinner here instead of FaSpinner
        <MiniSpinner />
      ) : (
        <motion.div
          className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Left - Profile Image */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="flex justify-center"
          >
            {aboutImage ? (
              <img
                src={aboutImage}
                alt="About"
                className="w-80 h-80 object-cover rounded-full border-4 border-blue-400 shadow-lg"
              />
            ) : (
              <div className="w-80 h-80 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-lg">
                No Image
              </div>
            )}
          </motion.div>

          {/* Right - Text and Resume Button */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {aboutText || "No about text available."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={downloading}
              className={`mt-6 px-6 py-3 rounded transition font-medium text-white flex items-center gap-2 ${
                downloading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {downloading ? (
                <>
                  <MiniSpinner /> Downloading
                </>
              ) : (
                "Download Resume"
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default About;
