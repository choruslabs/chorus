import { useState } from "react";
import { login } from "../../components/api/auth";
import Logo from "../../components/ui/logo";
import FullLogo from "../../assets/pol.is_.webp";
import { Button, Input } from "@headlessui/react";
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
      <div className="w-full bg-sky-500 flex pl-5 p-3">
        <Logo fill="white" />
        <h1 className="text-white text-xl font-bold ml-3">Polis</h1>
      </div>
      <div className="h-full flex flex-col items-center w-full md:w-1/3 p-4">
        <img src={FullLogo} alt="Polis Logo" className="h-32 w-32 mb-8 mt-14" />
        <h2 className="text-4xl font-bold mb-8">Sign in</h2>
        <div className="flex flex-col w-full border mb-8 rounded-xl p-4">
          <Input
            className="mb-4 bg-gray-100 rounded-md p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className="mb-6 bg-gray-100 rounded-md p-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="bg-sky-500 text-whiterounded"
            onClick={() => handleLogin(email, password)}
          >
            Sign in
          </Button>
        </div>
        <p>
          Don't have an account?{" "}
          <a href="/register" className="text-sky-500">
            Register here.
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
