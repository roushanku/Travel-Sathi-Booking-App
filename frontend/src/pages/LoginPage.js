import axios from "axios";
import { useContext, useState } from "react";
import { Link , useNavigate } from 'react-router-dom';
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const navigate = useNavigate();

   const {user,setUser} =  useContext(UserContext);



    async function handleUSerSubmit(ev) {
        ev.preventDefault();
        try {
            // console.log("Login Invoked");
            const UserInfo = {
                email:email,
                password:password
            }

            const res = await axios.post('http://localhost:4000/login' , UserInfo);
            console.log(res);
            setUser(res.data);
            console.log(user);

            alert("Login Successfull!");
            navigate('/');
        }
        catch(e){
            alert('login failed');
        } 
    }
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Login</h1>
            <form className="max-w-md mx-auto" onSubmit={handleUSerSubmit} >
                <input type="email" placeholder="your@email.com" 
                value={email} 
                onChange={ev => setEmail(ev.target.value)}></input>
                <input type="password" placeholder="password" 
                value={password} 
                onChange={ev => setPassword(ev.target.value)}></input>
                <button className="primary">Login</button>
                <div className="text-center py-2 text-gray-500">
                    Don't Have Account Yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                </div>
            </form>
            </div>
        </div>
    );
}