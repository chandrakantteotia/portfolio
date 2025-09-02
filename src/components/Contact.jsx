import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import  {db} from "../firebase"; // Adjust path if needed
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("contactInfo");
    if (stored) {
      setContactInfo(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        timestamp: serverTimestamp(),
      });

      toast.success("Message sent successfully!");
      e.target.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 text-[#0f172a] px-6 py-20 sm:px-10 md:px-24 lg:px-32 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1e40af] mb-2">
          Let's Connect
        </h2>
        <p className="text-lg text-gray-600">
          I’d love to hear from you. Reach out any time!
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-8 space-y-5"
        >
          <h3 className="text-2xl font-semibold text-[#1e3a8a] mb-4">
            Contact Information
          </h3>
          <p>
            <strong>Email:</strong>{" "}
            {contactInfo.email ? (
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-gray-800 hover:text-blue-700 transition-colors"
              >
                {contactInfo.email}
              </a>
            ) : (
              "Not provided"
            )}
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            {contactInfo.phone ? (
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-gray-800 hover:text-blue-700 transition-colors"
              >
                {contactInfo.phone}
              </a>
            ) : (
              "Not provided"
            )}
          </p>
          <p>
            <strong>Location:</strong> {contactInfo.location || "Not provided"}
          </p>
          <p>
            <strong>LinkedIn:</strong>{" "}
            {contactInfo.linkedin ? (
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-gray-800 hover:text-blue-700 transition-colors"
              >
                {contactInfo.linkedin}
              </a>
            ) : (
              "Not provided"
            )}
          </p>
          <p>
            <strong>GitHub:</strong>{" "}
            {contactInfo.github ? (
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noreferrer"
                className="text-gray-800 hover:text-blue-700 transition-colors"
              >
                {contactInfo.github}
              </a>
            ) : (
              "Not provided"
            )}
          </p>
        </motion.div>

        {/* Send Message Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <h3 className="text-2xl font-semibold text-[#1e3a8a] mb-4">
            Send a Message
          </h3>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              placeholder="Type your message here..."
              rows="4"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#2563eb] text-white px-6 py-3 rounded-full text-lg font-medium hover:scale-105 hover:bg-[#1e40af] transition-transform ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
