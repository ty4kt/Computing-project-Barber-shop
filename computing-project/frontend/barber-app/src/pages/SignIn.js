import React, { useState } from "react";
import Layout from "../components/Layout";
import Input from "./../components/Input";
import useRedirect from "../hooks/useRedirect";
import Button from "./../components/Button";
import Logo from "./../components/Logo";
import { signInRequest } from "../utils/account";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
  const { setIsAuthenticated } = useAuth();
  const redirectTo = useRedirect();

  const handleRedirect = (url) => () => {
    redirectTo(url);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Invalid email address");
      return;
    }

    setErrorMessage("");

    try {
      await signInRequest(email, password);
      setIsAuthenticated(true);
      // localStorage.setItem("authToken", );
      redirectTo("/dashboard");

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Layout backgroundColor={`bg-[#020202]`} centerContent={true}>
      <div className="text-center text-white p-3">
        <Logo />
        <h1 className="text-4xl font-bold p-4">Sign In</h1>
        <p>Log into your account</p>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <form onSubmit={handleSignUp} className="mt-8 space-y-4 p-4 sm:p-6 lg:p-8 shadow-lg">
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

          <p
            className="cursor-pointer text-left"
            onClick={handleRedirect("/forget-password")}
          >
            Forgot your password?
          </p>

          <Button
            type="submit"
            text="Sign In"
            modifyClass={`bg-barber-blue hover:bg-blue-700 transition text-white font-bold py-2 px-12 rounded-full mt-4 text-lg`}
          />
        </form>
        <small className="block mt-2">or</small>
        <Button
          text="Sign Up"
          modifyClass="bg-transparent text-white font-bold py-2 px-12 rounded-full text-lg mt-4"
          onClick={handleRedirect("/signup")}
        />
      </div>
    </Layout>
  );
};

export default SignIn;
