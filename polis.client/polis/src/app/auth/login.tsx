import { useState } from "react";
import { login } from "../../components/api/auth";
import Logo from "../../components/ui/logo";
import { Input } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="w-full p-3 bg-teal-600 flex pl-5">
        <Logo fill="white" />
        <h1 className="ml-2 text-white text-xl font-bold">Polis</h1>
      </div>
      <div className="flex flex-col justify-center items-center h-full w-1/3">
        <h2 className="text-4xl font-bold mb-8">Sign in</h2>
        <div className="flex flex-col w-full border p-8 mb-8 rounded-xl">
          <Input
            className="mb-4 p-2 pl-3 bg-gray-100 rounded-md"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className="mb-6 p-2 pl-3 bg-gray-100 rounded-md"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-teal-600 text-white p-2 rounded"
            onClick={() => handleLogin(email, password)}
          >
            Sign in
          </button>
        </div>
        <p>
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register here.
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
