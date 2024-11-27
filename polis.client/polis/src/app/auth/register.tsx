import { useState } from "react";
import { register } from "../../components/api/auth";
import Logo from "../../components/ui/logo";
import { Button, Input } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string) => {
    try {
      await register(email, password);
      navigate("/login");
    } catch (error) {
      console.error("Error registering");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="w-full p-3 bg-teal-600 flex pl-5">
        <Logo fill="white" />
        <h1 className="ml-2 text-white text-xl font-bold">Polis</h1>
      </div>
      <div className="flex flex-col justify-center items-center h-full w-1/3">
        <h2 className="text-4xl font-bold mb-8">Create an account</h2>
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
          <Button
            className="bg-teal-600 text-white p-2 rounded"
            onClick={() => handleRegister(email, password)}
          >
            Register
          </Button>
        </div>
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Sign in here.
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
