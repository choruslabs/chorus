import { useState } from "react";
import { postRegister } from "../../components/api/auth";
import Logo from "../../components/ui/logo";
import FullLogo from "../../assets/pol.is_.webp";
import { Button, Input } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string) => {
    try {
      await postRegister(email, password);
      navigate("/login");
    } catch (error: any) {
      if (error.status == 409) {
        setError("Email already in use. Please sign in.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="w-full bg-sky-500 flex pl-5 p-3">
        <Logo fill="white" />
        <h1 className="text-white text-xl font-bold ml-3">Polis</h1>
      </div>
      <div className="h-full flex flex-col items-center w-full md:w-1/3 p-4">
        {error && (
          <div className="bg-red-500 text-white p-2 rounded-md mb-4 absolute top-16">
            {error}
          </div>
        )}
        <img src={FullLogo} alt="Polis Logo" className="h-32 w-32 mb-8 mt-14" />
        <h2 className="text-4xl font-bold mb-8">Create an Account</h2>
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
            onClick={() => handleRegister(email, password)}
          >
            Register
          </Button>
        </div>
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-sky-500">
            Sign in here.
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
