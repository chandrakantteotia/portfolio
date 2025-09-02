// 📍 This is for USER PANEL (not admin)
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProjects } from "./admin/project/projectService"; // adjust path if needed

const techIcons = {
  React: "⚛️",
  Tailwind: "🌬️",
  JavaScript: "🟨",
  HTML: "📄",
  CSS: "🎨",
  Node: "🟩",
  Express: "🚂",
  MongoDB: "🍃",
  TypeScript: "🔷",
  Firebase: "🔥",
  GitHub: "🐙",
  Python: "🐍",
  NextJS: "➡️",
  Vite: "⚡",
  Vue: "🟢",
};

const MiniSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        console.log("Fetched projects:", data);
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

    return (
      <section id="projects" className="min-h-screen bg-[#f3f4f6] text-[#111827] px-6 py-16 sm:px-10 md:px-20 lg:px-32">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">Projects</h2>

        {loading ? (
          <MiniSpinner />
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-600">No projects found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <div
                key={project.id || index}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <ImageSlider images={Array.isArray(project.images) ? project.images : []} />
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-[#4b5563] text-sm mb-3">{project.description}</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {project.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <span>{techIcons[tech] || "🏷️"}</span>
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <img
        src="public/no-image.jpg"
        alt="No preview"
        className="w-full h-48 object-cover"
      />
    );
  }

  return (
    <div className="relative w-full h-48 overflow-hidden">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`slide-${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
    </div>
  );
};

export default Projects;
