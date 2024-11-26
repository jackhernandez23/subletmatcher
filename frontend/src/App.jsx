import React from "react";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages/index.jsx";
import Listings from "./pages/listings.jsx";
import MyListings from "./pages/mylistings.jsx";
import SignUp from "./pages/signup.jsx";
import LogIn from "./pages/login.jsx";
import Addlease from "./pages/addlease.jsx";
import Settings from "./pages/settings.jsx";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/mylistings" element={<MyListings />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/addlease" element={<Addlease />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Router>
    );
}

export default App;