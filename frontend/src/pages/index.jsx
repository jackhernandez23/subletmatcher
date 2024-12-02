import React from "react";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 text-white">
            <header className="text-center mb-12">
                <h1 className="text-6xl font-bold mb-4">
                    Welcome to SubletMatcher
                </h1>
                <h2 className="text-xl font-medium">
                    A program to match sublessors with subletters in Gainesville.
                </h2>
            </header>
            <div className="flex space-x-6 mt-6">
                <button onClick={() => {
                    window.location.href = '/signup';
                }}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-400 transition">
                    Sign Up
                </button>
                <button2 onClick={() => {
                    window.location.href = '/login';
                }}
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition">
                    Log In
                </button2>
                <button3 onClick={() => {
                    window.location.href = '/listings';
                }}
                         className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-teal-500 transition">
                    Browse Listings
                </button3>
            </div>
        </div>
    );
};

export default Home;