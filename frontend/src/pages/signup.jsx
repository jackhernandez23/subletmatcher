import React, {useState} from "react";
import Cookies from 'js-cookie';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const isEmailValid = (email) => {
        let validEmail = false;
        const atIndex = email.indexOf('@');             // find position
        const dotIndex = email.lastIndexOf('.');

        if (atIndex < 1 && atIndex !== email.lastIndexOf('@'))      // make sure @ is not at start or end
            validEmail= false;
        if (dotIndex < atIndex + 2 && dotIndex === email.length - 1)        // make sure . is after @ and not directly after it
             validEmail= false;
        if (!email.endsWith('.com'))
             validEmail= false;
        else
            validEmail = true;

        return validEmail;
    };

    const isPasswordValid = (password) => {
        if (password.length < 8)            // password must be at least 8 characters
            return false;

        let hasUppercase = false;
        let hasLowercase = false;
        let hasNumber = false;

        for (const char of password) {     // loop to make sure password is secure enough
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
            if (!email || !password) {              // if user didn't fill in both email and password fields
                alert("Please fill in both email and password");
                return;
            }
            if (!isEmailValid(email)) {
                alert("Please enter a valid email address");
                return;
            }
            if (password.length <  8) {
                alert("Sign up failed, password must be at least 8 characters long");
                return;
            }
            if (!isPasswordValid(password)) {
                alert('Sign up failed, password must contain at least 1 uppercase, 1 lowercase and 1 number');
                return;
            }
            if (isEmailValid(email) || isPasswordValid(password)) {
                setSuccessMessage("Thank you for signing up!");
                Cookies.set('email', email);
                console.log("redirecting...")
                window.location.href = '/profile';
            }
    };

return (
    <div className="flex justify-center p-40">
            <div className="flex justify-center items-center flex-col space-y-6 fixed p-16 bg-gray-300 rounded-md">
                <h1>
                    Sign up
                </h1>
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={"bg-gray-200 p-2"}
                    type="email"
                />
                <input
                    value={password}
                    placeholder="Enter your password"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={"bg-gray-200 p-2"}
                    type="password"
                />
            <button onClick={onButtonClick} className={"bg-blue-500 text-white p-2 rounded"}>
                Sign up
            </button>
            </div>
        {successMessage && <div className={"text-green-500 text-2xl text-center mt-40"}>
            {successMessage}</div>}
        </div>
    );
};

export default Signup;