import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <nav className="bg-teal-400 h-20 flex justify-center items-center px-4 z-12">
                <div className="flex justify-center space-x-4">
                    <Link className="text-gray-500 flex items-center px-4 h-full cursor-pointer" to="/" activeStyle>
                        Home
                    </Link>
                    <Link className="text-gray-500 flex items-center px-4 h-full cursor-pointer" to="/listings" activeStyle>
                        Listings
                    </Link>
                    <Link className="text-gray-500 flex items-center px-4 h-full cursor-pointer" to="/profile" activeStyle>
                        Profile
                    </Link>
                    <Link className="text-gray-500 flex items-center px-4 h-full cursor-pointer" to="/signup" activeStyle>
                        Login/Signup
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default Navbar;

