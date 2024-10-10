import React, { useState } from "react";
import Layout from "../components/Layout";
import Input from "./../components/Input";
import useRedirect from "../hooks/useRedirect";
import Button from "./../components/Button";
import Logo from "./../components/Logo";
import { signUpRequest } from "../utils/account";
import { useAuth } from "../contexts/AuthContext";

const SignUp = () => {
  const { setIsAuthenticated } = useAuth();
  const redirectTo = useRedirect();

  const handleRedirect = (url) => () => {
    redirectTo(url);
  };

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Invalid email address");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setErrorMessage("");

    try {
      await signUpRequest(fullName, email, password);
      setIsAuthenticated(true);
      // localStorage.setItem("authToken", "token");
      
      redirectTo("/account-setup");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Layout backgroundColor={`bg-[#020202]`} centerContent={true}>
      <div className="text-center text-white p-3">
        <Logo />
        <h1 className="text-4xl font-bold p-4">Sign Up</h1>
        <p>Create an account</p>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <form onSubmit={handleSignUp} className="mt-8 space-y-4 p-4 sm:p-6 lg:p-8 shadow-lg">
          <Input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <p className="text-sm text-left">
            By signing up, you agree to our <a>Privacy Policy</a> &{" "}
            <a>Terms Of Service</a>
          </p>

          {/* <button
            type="submit"
            className="bg-barber-blue hover:bg-blue-700 transition text-white font-bold py-2 px-12 rounded-full mt-4 text-lg"
          >
            Sign Up
          </button> */}

          <Button
            type="submit"
            text="Sign Up"
            modifyClass={`bg-barber-blue hover:bg-blue-700 transition text-white font-bold py-2 px-12 rounded-full mt-4 text-lg`}
          />
        </form>
        <small className="block mt-2">or</small>
        <button
          className="text-white py-2 px-4 rounded mt-2"
          onClick={handleRedirect("/signin")}
        >
          Sign In
        </button>
      </div>
    </Layout>
  );
};

export default SignUp;
