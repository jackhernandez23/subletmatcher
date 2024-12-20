import {React, useState} from "react";
import Cookies from 'js-cookie';
import $ from 'jQuery';

const Login = () => {

    // redirect if user is already logged in
    if (Cookies.get('email')) {
        window.location.href = '/';
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
   

    const onButtonClick = async () => {         // email and password verification
            if (!email || !password) {              // if user didn't fill in both email and password fields
                alert("Please fill in both email and password");
                return;
            }

            //connect to backend to check for successful login
            try {
                const sendData = { email: email, password: password };
                await $.ajax({
                    url: 'http://127.0.0.1:5000/login',
                    type: 'GET',
                    data: sendData,
                    success: function(response) {
                        console.log('Data received:', JSON.stringify(response));

                        //log user in on successful login attempt
                        if(response.success) {
                            setSuccessMessage("You are logged in");
                            Cookies.set('email', email);
                            console.log("redirecting...")
                            window.location.href = '/';
                        } else {
                            alert("Incorrect email or password")
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
    };

return (
    <div className="flex justify-center p-28">
            <div className="flex justify-center items-center flex-col space-y-6 fixed p-16 bg-gradient-to-b from-teal-300 to-blue-300 rounded-md">
                <h1 className="text-xl font-bold">
                    Log in
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
                <button onClick={onButtonClick} className={"bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-teal-400 transition"}>
                    Log in
                </button>
                <div className="flex items-center">
                    <h1 className="px-4"> 
                        Need to make an account? 
                    </h1>
                    <button onClick={() => { window.location.href = '/signup'; }} className={"bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-teal-400 transition"}>
                        Sign up
                    </button>
                </div>
            </div>
        {successMessage && <div className={"text-green-500 text-2xl text-center mt-40"}>
            {successMessage}</div>}
        </div>
    );
};

export default Login;



