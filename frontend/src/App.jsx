import React from "react";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import $ from "jquery";
import Home from "./pages/index.jsx";
import Listings from "./pages/listings.jsx";
import Profile from "./pages/profile.jsx";
import SignUp from "./pages/signup.jsx";
import LogIn from "./pages/login.jsx";
import Upload from "./pages/upload.jsx";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/upload" element={<Upload />} />
            </Routes>
        </Router>
    );
}

export default App;