import { Link } from "react-router-dom";
import NavbarAuth from "./NavbarAuth";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full">
      <Link to="/" className="flex items-center space-x-2">
        <span className="font-bold text-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          CryptoNXT
        </span>
      </Link>
      <div className="ml-10 space-x-6 hidden md:flex">
        <Link
          to="/"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/about"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors"
        >
          About
        </Link>
      </div>
      <div className="ml-auto">{/* <NavbarAuth /> */}</div>
    </nav>
  );
};

export default Navbar;
