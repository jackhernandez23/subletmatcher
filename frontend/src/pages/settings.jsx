import React, {useState} from "react";
import Cookies from "js-cookie";
import $ from 'jQuery';

const Settings = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const isPasswordValid = (password) => {
        if (password.length < 8)            // password must be at least 8 characters
            return false;

        let hasUppercase = false;
        let hasLowercase = false;
        let hasNumber = false;

        for (let i = 0; i < password.length; i++) {     // loop to make sure password is secure enough
            const char = password[i];
            if (char >= "A" && char <= "Z")
                hasUppercase = true;
            else if (char >= "a" && char <= "z")
                hasLowercase = true;
            else if (char >= "0" && char <= "9")
                hasNumber = true;
            if (hasUppercase && hasLowercase && hasNumber)
                return true;
        }
        return hasUppercase && hasLowercase && hasNumber;
    };

    const changePassword = async () => {         // email and password verification
            if(password != confirmPassword) {
                alert("Passwords do not match");
                return;
            }
        
            if (password.length <  8) {
                alert("New password must be at least 8 characters long");
                return;
            }
            if (!isPasswordValid(password)) {
                alert('New password must contain at least 1 uppercase, 1 lowercase and 1 number');
                return;
            }

            // make HTTP request to send data to backend
            try {
                const sendData = { email: Cookies.get('email'), password: password };
                await $.ajax({
                    url: 'http://127.0.0.1:5000/change-password',
                    type: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(sendData),
                    success: function(response) {
                        console.log('Data received:', JSON.stringify(response));

                        //log user in on successful login attempt
                        if(response.success) {
                            alert("Password successfully changed. Plese log back in.")
                            Cookies.remove('email');
                            console.log("redirecting...")
                            window.location.href = '/login';
                        } else {
                            alert("An error occured.")
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
    };

    const handleSubmit = async () => {
        if (!profilePicture) {
            alert("Please select a file.");
            return;
        }
        try {
            alert("Profile picture updated successfully!");
        }
        catch (error) {
            console.error('Network error:', error);
            alert("An error occurred while updating profile picture")
        }
    }

    return (
        <div className="flex flex-col justify-center items-center p-10 pb-16 h-full">
            <div className="flex justify-center items-center">
                <h1 className="text-5xl font-bold">
                    Settings
                </h1>
            </div>

            <div className="flex flex-col justify-center items-center py-10 w-full space-y-10">
                <div className="flex flex-col justify-center items-center">
                    <h1>Reset Password</h1>
                    <div className="justify-center grid grid-cols-2 grid-rows-2 space-y-6 items-center">
                        <label className="p-2 mt-6" htmlFor="password">New password</label>
                        <input
                            value={password}
                            placeholder=""
                            onChange={(ev) => setPassword(ev.target.value)}
                            className={"bg-gray-200 p-2"}
                            type="password"
                            autoComplete="new-password"
                        />
                        <label className="p-2" htmlFor="password">Confirm password</label>
                        <input
                            value={confirmPassword}
                            placeholder=""
                            onChange={(ev) => setConfirmPassword(ev.target.value)}
                            className={"bg-gray-200 p-2"}
                            type="password"
                            autoComplete="new-password"
                        />
                </div>

                <button onClick={changePassword} className="bg-blue-500 text-white m-4 p-2 rounded items-center">
                    Change Password
                </button>

                <div className="flex flex-col justify-center items-center p-20 w-full space-y-10">
                    <div className="justify-center w-3/4 flex flex-row space-x-2">
                        <label className="items-start w-1/4" htmlFor="profilePicture">Upload new profile picture </label>
                        <input
                            type="file"
                            onChange={(ev) => setProfilePicture(ev.target.value)}
                            className={"bg-gray-200 p-2 w-1/2"}
                        />
                        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
                            Submit
                        </button>
                    </div>
                </div>

                <button onClick={() => {window.location.href = '/mylistings'}} className="bg-blue-500 text-white p-2 rounded">
                            View My Listings
                </button>

                </div>
            </div>
        </div>
    )};

export default Settings;
