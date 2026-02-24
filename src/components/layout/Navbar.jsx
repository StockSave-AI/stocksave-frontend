import { NavLink } from "react-router-dom";
import { useState } from "react";
import { IoCloseSharp, IoMenuSharp } from "react-icons/io5";
import Logo from "./Logo";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-primary-500 font-semibold"
      : "text-neutral-600 hover:text-neutral-500";

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <>
      <nav className="bg-neutral-100 border-b border-neutral-200 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center xl:px-10">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Logo />
            Stock Save AI
          </div>

          <div className="hidden md:flex gap-10 text-[16px]">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/features" className={linkClass}>
              Features
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </div>

          <div className="hidden md:flex gap-6 items-center">
            <NavLink to="/login">
              <button className="text-[16px] text-neutral-600 hover:text-neutral-500">
                Login
              </button>
            </NavLink>

            <NavLink to="/signup">
              <button className="bg-primary-500 text-white px-4 py-2 rounded-button text-sm hover:bg-primary-400">
                Sign Up
              </button>
            </NavLink>
          </div>

          <button
            onClick={() => setNavOpen(true)}
            className="md:hidden text-2xl"
          >
            <IoMenuSharp />
          </button>
        </div>
      </nav>

      {navOpen && (
        <div
          onClick={closeNav}
          className="fixed inset-0 bg-black/40 z-40"
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          navOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-6">
          <button onClick={closeNav} className="self-end text-xl">
            <IoCloseSharp />
          </button>

          <NavLink onClick={closeNav} to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink onClick={closeNav} to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink onClick={closeNav} to="/features" className={linkClass}>
            Features
          </NavLink>
          <NavLink onClick={closeNav} to="/contact" className={linkClass}>
            Contact
          </NavLink>

          <div className="border-t pt-4 flex flex-col gap-4">
            <NavLink onClick={closeNav} to="/login">
              <button className="text-neutral-600 w-full text-left">
                Login
              </button>
            </NavLink>

            <NavLink onClick={closeNav} to="/signup">
              <button className="bg-primary-500 text-white px-4 py-2 rounded-button w-full">
                Sign Up
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
