import { useContext, useState } from "react";
import { Input } from "@headlessui/react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../components/context/AuthContext";
import CoreBase from "../core/base";

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      if (error.status === 401) {
        setError("Invalid email or password.");
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
          className="flex flex-col justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, password);
          }}
        >
          {error && (
            <div className="bg-red-500 text-white p-2 rounded-md mb-4 absolute top-16 self-center">
              {error}
            </div>
          )}
          <h2 className="text-5xl font-bold mb-8">Sign In</h2>
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
            onClick={() => handleLogin(email, password)}
          >
            Sign in
          </button>
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-text-secondary">
              Register here.
            </a>
          </p>
        </form>
      </div>
    </CoreBase>
  );
};

export default LoginPage;
