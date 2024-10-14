import React from "react";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages/index.jsx";
import Listings from "./pages/listings.jsx";
import Profile from "./pages/profile.jsx";
import SignUp from "./pages/signup.jsx";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                    path="/signup"
                    element={<SignUp />}
                />
            </Routes>
        </Router>
    );
}

export default App;