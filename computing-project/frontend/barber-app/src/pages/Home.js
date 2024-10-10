import React from "react";
import Layout from "../components/Layout";
import useRedirect from "../hooks/useRedirect";
import Logo from "../components/Logo";
import Button from "../components/Button";

const Home = () => {
  const backgroundImageUrl = "images/barber-stock.png";

  const redirectTo = useRedirect();

  const handleRedirect = (url) => () => {
    redirectTo(url);
  };
  
  return (
    <Layout backgroundImage={backgroundImageUrl} centerContent={true}>
      <div className="text-center text-white">
        <Logo />
        <h1 className="text-4xl font-bold p-4">
          Find a new barber
          <br />
          in seconds.
        </h1>
        <p className="mt-2">
          Find your professional barber at your fingertips.
        </p>

        <div className="mt-8">

        <Button 
          text="Get Started"
          modifyClass="bg-barber-blue hover:bg-blue-700 transition text-white font-bold py-2 px-12 rounded-full text-lg"
          onClick={handleRedirect('/signup')}
        />
          <small className="block mt-2">or</small>

        <Button
          text="Sign In"
          modifyClass="bg-transparent border-2 border-white text-white font-bold py-2 px-12 rounded-full text-lg mt-4"
          onClick={handleRedirect('/signin')}
        />

        </div>
      </div>
    </Layout>
  );
};

export default Home;
