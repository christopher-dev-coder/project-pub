"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await axios.post(`http://localhost:3001${url}`, { username, password });
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        router.push("/");
      } else {
        alert("Registration has been completed successfully!");
        setIsLogin(true);
      }
    } catch (err) {
      alert("An error accoured!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl mb-4">{isLogin ? "Sign in" : "Sign up"}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-2 border rounded"/>
          <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-2 border rounded"/>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            {isLogin ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 mt-2">
          {isLogin ? "Do not have an account? Register now." : "You already have an account? Sign in now."}
        </button>
      </div>
    </div>
  );
}
