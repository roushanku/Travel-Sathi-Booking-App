import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Registerpage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleType, setRoleType] = useState('user');
  const [toast, setToast] = useState(null);
  const Toast = ({ message, type }) => {
    return (
      <div
        className={`fixed top-4 right-4 p-4 rounded-md ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white shadow-lg`}
      >
        {message}
      </div>
    );
  };
  async function registerUser(event) {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/register", {
        name,
        email,
        password,
        roleType,
      });
      
      if (res.data.message === "User already registered...") {
        setToast({ message: "User already registered", type: "error" });
      } else {
        setToast({ message: "Registration successful. You can now login.", type: "success" });
      }
    } catch (err) {
      setToast({ message: "Registration failed. Please try again.", type: "error" });
    }
    
    // Clear toast after 3 seconds
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Ram"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          ></input>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          ></input>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          ></input>
          <select
            value={roleType}
            onChange={(ev) => setRoleType(ev.target.value)}
            className="w-full border my-1 py-2 px-3 rounded-2xl"
          >
            <option value="user">User</option>
            <option value="Hotel">Hotel</option>
          </select>
          <button className="primary">Register</button>
          {toast && <Toast message={toast.message} type={toast.type} />}
          <div className="text-center py-2 text-gray-500">
            Already a member{" "}
            <Link className="underline text-black" to={"/login"}>
              {" "}
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
