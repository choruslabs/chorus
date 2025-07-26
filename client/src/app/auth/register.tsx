import { Input } from "@headlessui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { postRegister } from "../../components/api/auth";
import CoreBase from "../core/base";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string) => {
    try {
      await postRegister(email, password);
      navigate("/login");
    } catch (error) {
      if (error.status === 409) {
        setError("Email already in use. Please sign in.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <CoreBase>
      <div
        id="sign-in-container"
        className="flex-2 w-full h-full flex justify-center p-8 md:p-0"
      >
        <form
          className="self-center flex flex-col justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister(email, password);
          }}
        >
          {error && (
            <div className="bg-red-500 text-white p-2 rounded-md mb-4 absolute top-16 self-center">
              {error}
            </div>
          )}
          <h2 className="text-5xl font-bold mb-8">Create an Account</h2>
          <Input
            className="mb-4 bg-gray-100 rounded-md p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className="mb-4 bg-gray-100 rounded-md p-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="mb-8 p-2 bg-gray-500 hover:bg-secondary text-white rounded-md"
          >
            Register
          </button>
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-emerald-500">
              Sign in here.
            </a>
          </p>
        </form>
      </div>
    </CoreBase>
  );
};

export default RegisterPage;
