import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

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
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const { user, setUser } = useContext(UserContext);

  async function handleUSerSubmit(ev) {
    ev.preventDefault();
    try {
      // console.log("Login Invoked");
      const UserInfo = {
        email: email,
        password: password,
      };

      const res = await axios.post("http://localhost:4000/login", UserInfo);
      //   console.log(res);
      setUser(res.data);
      //   console.log(user);

      setToast({ message: "Login successful!", type: "success" });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setToast({ message: "Incorrect password", type: "error" });
        } else if (error.response.status === 401) {
          setToast({ message: "User not found", type: "error" });
        } else {
          setToast({ message: "Login failed", type: "error" });
        }
      } else {
        setToast({ message: "Network error", type: "error" });
      }
    }
    // Clear toast after 3 seconds
    setTimeout(() => setToast(null), 3000);
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleUSerSubmit}>
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
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't Have Account Yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
