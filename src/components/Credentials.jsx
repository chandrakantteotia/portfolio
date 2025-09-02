import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const skillLogos = {
  javascript: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
  react: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  nodejs: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg",
  html: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg",
  css: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg",
  tailwind: "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg",
  firebase: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
  python: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
  typescript: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
  mongodb: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg",
  git: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg",
  docker: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg",
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const Credentials = () => {
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const intervalsRef = useRef({});
  const audioRef = useRef(null);

  const prevSkillsRef = useRef([]);
  const prevCertsRef = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const skillsSnap = await getDocs(collection(db, "skills"));
        const certSnap = await getDocs(collection(db, "certificates"));
        const skillsData = skillsSnap.docs.map((doc) => doc.data());
        const certData = certSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (
          JSON.stringify(prevSkillsRef.current) !== JSON.stringify(skillsData) ||
          JSON.stringify(prevCertsRef.current) !== JSON.stringify(certData)
        ) {
          if (audioRef.current) {
            audioRef.current.play().catch((err) => console.log("Audio error:", err));
          }
        }

        prevSkillsRef.current = skillsData;
        prevCertsRef.current = certData;

        setSkills(skillsData);
        setCertificates(certData);

        const indexes = {};
        certData.forEach((cert) => {
          indexes[cert.id] = 0;
        });
        setImageIndexes(indexes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};
    certificates.forEach((cert) => {
      const images = cert.imageUrls?.length > 0 ? cert.imageUrls : [cert.imageUrl];
      if (images.length > 1) {
        intervalsRef.current[cert.id] = setInterval(() => {
          setImageIndexes((prev) => ({
            ...prev,
            [cert.id]: (prev[cert.id] + 1) % images.length,
          }));
        }, 3000);
      }
    });

    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, [certificates]);

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const handlePrevImage = (certId, length) => {
    setImageIndexes((prev) => ({
      ...prev,
      [certId]: prev[certId] === 0 ? length - 1 : prev[certId] - 1,
    }));
  };

  const handleNextImage = (certId, length) => {
    setImageIndexes((prev) => ({
      ...prev,
      [certId]: prev[certId] === length - 1 ? 0 : prev[certId] + 1,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section id="credentials" className="p-6 max-w-7xl mx-auto bg-gray-50">
      <audio ref={audioRef} src="./components/admin/audio/notification.mp3" preload="auto" />

      {/* Skills Section */}
      <motion.section
        className="mb-16"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-4xl font-bold text-center mt-15 mb-10 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Skills
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {skills.map((skill, index) => {
            const logoUrl = skillLogos[skill.name.toLowerCase()];
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition-all transform hover:scale-105"
                variants={fadeUpVariant}
              >
                {logoUrl ? (
                  <img src={logoUrl} alt={skill.name} className="w-14 h-14 object-contain mb-3" />
                ) : (
                  <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center text-xl text-blue-800 font-bold mb-3">
                    {getInitials(skill.name)}
                  </div>
                )}
                <p className="text-gray-800 font-medium text-lg text-center">{skill.name}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Certificates Section */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-4xl font-bold text-center mb-10 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Certificates
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {certificates.map((cert) => {
            const images = cert.imageUrls?.length > 0 ? cert.imageUrls : [cert.imageUrl];
            const currentIndex = imageIndexes[cert.id] || 0;

            return (
              <motion.div
                key={cert.id}
                className="bg-white shadow-lg rounded-xl overflow-hidden p-5 flex flex-col items-center hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                variants={fadeUpVariant}
              >
                <div className="relative w-full h-48 mb-4">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={images[currentIndex]}
                      src={images[currentIndex]}
                      alt={`certificate-${cert.id}-${currentIndex}`}
                      className="w-full h-full object-contain rounded"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => handlePrevImage(cert.id, images.length)}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded-full hover:bg-opacity-60"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => handleNextImage(cert.id, images.length)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded-full hover:bg-opacity-60"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 text-center">{cert.title}</h4>
                <p className="text-gray-600 text-center text-sm mt-2">{cert.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>
  </section>
  );
};

export default Credentials;
