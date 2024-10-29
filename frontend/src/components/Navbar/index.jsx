import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <nav className="bg-teal-400 h-16 flex justify-between items-center px-10 z-12 w-full">
                    <div className="flex-1"></div>
                    <div className="flex-4 flex items-center">
                        <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/">
                            Home
                        </Link>
                        <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/listings">
                            Listings
                        </Link>
                        <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/profile">
                            Profile
                        </Link>
                        <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/upload">
                            Add a listing
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-end">
                    <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/login">
                            Login
                        </Link>
                        <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/signup">
                            Singup
                        </Link>
                    </div>  
            </nav>
        </>
    );
};

export default Navbar;

