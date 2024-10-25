import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const isEmailValid = (email) => {
        /*var emailDomains = {
            "-gmail.com": true,
            "-yahoo.com": true,
            "-hotmail.com": true,
            "-aol.com": true,
        };
        let validEmail = false;
        var matches = validEmail.match(/@(.*)$/);
        if (email) {
            if ("-" + matches[1] in emailDomains) {
                return true;
            }
        }
        return false;
         */
        // need to add checks for valid emails like @gmail.com, etc.
        let hasAtsign = false;
        let hasDotcom = false;
        for (let i = 0; i < email.length; i++) {
            const char = email[i];
            if (char >= "@")
                hasAtsign = true;
            else if (char >= "." && char <= "m")
                hasDotcom = true;
            if (hasDotcom && hasAtsign)
                return true;
        }
        return hasDotcom && hasAtsign;
    };

    const isPasswordValid = (password) => {
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
        while (Login) {
            if (!email || !password) {              // if user didn't fill in both email and password fields
                alert("Please fill in both email and password");
                return;
            }
            if (!isPasswordValid(password)) {
                alert('Log in failed, incorrect password');
                return;
            }
            if (!isEmailValid(email)) {
                alert("Please enter a valid email address");
                return;
            }
            if (isEmailValid(email) || isPasswordValid(password)) {
                setSuccessMessage("You are logged in");
            }
        }
    };

return (
    <div className="flex justify-center p-40">
        <h1>
            Login page
            </h1>
            <div className="flex fixed p-20">
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
                Log in
            </button>
            </div>
        {successMessage && <div className={"text-green-500 text-2xl text-center mt-40"}>
            {successMessage}</div>}
        </div>
    );
};

export default Login;



