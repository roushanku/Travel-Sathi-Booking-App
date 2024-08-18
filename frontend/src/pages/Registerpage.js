import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Registerpage() {
    const [name , setName] = useState('');
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');

    async function registerUser(event){
        event.preventDefault();
        try{
            const res = await axios.post("http://localhost:4000/register",{name,email,password});
            // console.log("This is the response from the backend",res.data);
            alert('Registration is Successful Now You can login');
        }catch(err){
            // console.log("This is the error",err);
            alert('Registration is failed, please try again');
        }
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Register</h1>
            <form className="max-w-md mx-auto" onSubmit={registerUser}>
                <input type="text" 
                placeholder="Ram" 
                value={name} 
                onChange={ev => setName(ev.target.value)}></input>
                <input type="email" 
                placeholder="your@email.com"
                value={email}
                onChange={ev => setEmail(ev.target.value)}></input>
                <input type="password" 
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}></input>
                <button className="primary">Register</button>
                <div className="text-center py-2 text-gray-500">
                    Already a member <Link className="underline text-black" to={'/login'}> Login</Link>
                </div>
            </form>
            </div>
        </div>
    );
}