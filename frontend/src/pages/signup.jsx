import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const onButtonClick = async () => {
        if (!email || !password) {              // if user didn't fill in both email and password fields
            alert("Please fill in both email and password")
            return;
        }

        try {
            const response = await fillerAPI(email, password)

            if (response.success) {
                navigate('/home')
            } else {
                alert('Login failed')
            }
        }
        catch (error) {
            console.error('Error logging in:', error)
            alert('An error occurred during login')
        }
    }

    return (
        <div className="flex justify-center p-40">
            <h1>
                Signup page
            </h1>
            <br/>
            <div className="flex fixed p-20">
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={"flex flex-col bg-gray-200"}
                />
            </div>
            <br/>
            <div className="flex fixed p-40">
                <input
                    value={password}
                    placeholder="Enter your password"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={"flex flex-col bg-gray-200"}
                />
            </div>
            <br/>
            <div className={'inputContainer'}>
            </div>
            </div>
            );
            };

            export default Signup;



