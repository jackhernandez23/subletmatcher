import React from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

const Navbar = () => {
    const loggedIn = Cookies.get('email');

    const logout = () => {
        Cookies.remove('email');
        location.reload();
    }

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
                        {loggedIn ? (
                            <div className="flex-4 flex items-center">
                                <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/mylistings">
                                    My Listings
                                </Link>
                                <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/addlease">
                                Add a listing
                                </Link>
                            </div>
                        ) : <></>}
                    </div>
                    {loggedIn ? (
                        <div className="flex-1 flex justify-end">
                            <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/settings">
                                Settings
                            </Link>
                            <button className= "text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex justify-end">
                            <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/login">
                                Login
                            </Link>
                            <Link className="text-gray-700 flex items-center px-4 h-full cursor-pointer text-lg" to="/signup">
                                Sign up
                            </Link>
                        </div>
                    )}  
            </nav>
        </>
    );
};

export default Navbar;

