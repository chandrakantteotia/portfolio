import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Scroll to section helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#hero" className="text-xl font-bold text-blue-700" onClick={() => scrollToSection("hero")}>My Portfolio</a>

        {/* Animated Hamburger Button */}
        <button
          className="md:hidden transition-transform duration-300 ease-in-out"
          onClick={toggleMenu}
        >
          <span
            className={`transition-transform duration-300 ease-in-out ${
              isOpen ? "scale-0 rotate-90 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <Menu className="w-6 h-6" />
          </span>
          <span
            className={`absolute transition-transform duration-300 ease-in-out ${
              isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <X className="w-6 h-6 mt-[-20px] mr-[29px]" />
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <a href="#hero" className="text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("hero")}>Home</a>
          <a href="#about" className="text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("about")}>About</a>
          <a href="#projects" className="text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("projects")}>Projects</a>
          <a href="#credentials" className="text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("credentials")}>Credentials</a>
          <a href="#contact" className="text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("contact")}>Contact</a>
        </nav>
      </div>

      {/* Animated Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out transform origin-top ${
          isOpen ? "max-h-[500px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-y-0"
        } overflow-hidden`}
      >
        <div className="bg-white shadow-md px-4 py-4 space-y-3">
          <a href="#hero" className="block text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("hero")}>Home</a>
          <a href="#about" className="block text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("about")}>About</a>
          <a href="#projects" className="block text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("projects")}>Projects</a>
          <a href="#credentials" className="block text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("credentials")}>Credentials</a>
          <a href="#contact" className="block text-gray-800 hover:text-blue-600 font-semibold" onClick={() => scrollToSection("contact")}>Contact</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
