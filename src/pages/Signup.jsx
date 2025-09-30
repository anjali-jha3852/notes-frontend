import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api"; // use the same api helper

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", { name, email, password });

      // ✅ Option 1: redirect to login after signup
      navigate("/");

      // ✅ Option 2 (optional): auto login user
      // localStorage.setItem("token", res.data.token);
      // navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="flex flex-col space-y-6 text-white max-w-md p-8 rounded-xl bg-white/20 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-black">Sign Up</h2>

        {error && <p className="text-red-400 text-center font-semibold">{error}</p>}

        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="p-3 rounded bg-white/20 placeholder-black text-black w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-white/20 placeholder-black text-black w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-white/20 placeholder-black text-black w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-red-800 hover:bg-red-950 text-white py-3 text-lg rounded font-semibold w-full"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm md:text-lg text-black">
          Already have an account?{" "}
          <Link to="/" className="underline text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
