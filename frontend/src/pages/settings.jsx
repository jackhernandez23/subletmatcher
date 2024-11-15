import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

// edit picture, edit password and edit leases

const Settings = () => {
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
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

    const onButtonClick = async () => {         // email and password verification
            if (password.length <  8) {
                alert("Password change failed, new password must be at least 8 characters long");
                return;
            }
            if (!isPasswordValid(password)) {
                alert('Password change failed, new password must contain at least 1 uppercase, 1 lowercase and 1 number');
                return;
            }
            if (isPasswordValid(password)) {
                setSuccessMessage("Your password is successfully changed");
                Cookies.set('password', password);
                console.log("redirecting...")
                window.location.href = '/profile';

                        // make HTTP request to send data to backend
        try {
            const response = await fetch('http://127.0.0.1:5000/settings', {
              method: 'POST',
              headers: {
                'Content-Type': 'settings/json'
              },
              body: JSON.stringify(password)
            });

            // handle the response
            if (response.ok) {
              const result = await response.json();
              console.log('Success:', result);
              window.location.href = '/';
            } else {
              console.error('Error:', response.statusText);
              alert("An error occurred while changing password")
            }
          } catch (error) {
            console.error('Network error:', error);
            alert("An error occurred while changing password")
          }
            }
    };

    const handleSubmit = async () => {
        if (!profilePicture) {
            alert("Please select a file.");
            return;
        }
        try {
            setSuccessMessage("Profile picture updated successfully!");
        }
        catch (error) {
            console.error('Network error:', error);
            alert("An error occurred while updating profile picture")
        }
    }

    return (
        <div className="flex flex-col justify-center items-center p-20 h-full space-y-30">
            <div className="flex justify-center items-center py-11">
                <h1 className="text-xl font-bold">
                    Settings
                </h1>
            </div>

            <div className="flex flex-col justify-center items-center p-20 w-full space-y-10">
                <div className="justify-center w-3/4 flex flex-row space-x-2">
                    <label className="items-start w-1/4" htmlFor="password">Change password </label>
                    <input
                        value={password}
                        placeholder="Enter your new password"
                        onChange={(ev) => setPassword(ev.target.value)}
                        className={"bg-gray-200 p-2 w-1/2"}
                        type="password"
                    />
                    <button onClick={onButtonClick} className="bg-blue-500 text-white p-2 rounded">
                        Submit
                    </button>
                </div>

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


                    <h1 className="flex justify-center text-lg">
                        Edit leases
                    </h1>
                </div>
            </div>

            );
            };

            export default Settings;
