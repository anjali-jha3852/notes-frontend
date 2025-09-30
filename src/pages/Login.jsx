import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api"; // use your api helper

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="flex flex-col space-y-4 text-white w-11/12 max-w-md p-8 rounded-xl bg-white/20 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-black">Login</h2>

        {error && (
          <p className="text-red-400 text-center font-semibold">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
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
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg rounded font-semibold w-full"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm md:text-lg text-black">
          Don’t have an account?{" "}
          <Link to="/signup" className="underline text-green-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
