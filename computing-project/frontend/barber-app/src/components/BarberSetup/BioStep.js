import React from "react";
import Button from "../Button";
import Logo from "./../Logo";
import Input from "../Input";
import { barberAccountSetup } from "../../utils/account";

const BioStep = ({ bio, setBio, nextStep }) => {
  const handleContinue = () => {
    try {
      let request = barberAccountSetup({ bio: bio }, "bioStep");

      nextStep();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className="text-white space-y-4 p-4 sm:p-6 lg:p-8">
      <Logo />

      <h2 className="text-xl font-bold mb-3">Set your bio</h2>
      <p>Write a bio about yourself and your services</p>

      <textarea
        placeholder="Write here"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className={"mt-5 p-2 h-32 w-full bg-black border rounded-lg"}
      ></textarea>
      <br />
      <div className="space-x-2">
        <Button
          onClick={handleContinue}
          text={`Continue`}
          modifyClass={`bg-barber-blue hover:bg-blue-700 transition text-white font-bold py-4 px-12 rounded-full mt-4`}
        ></Button>
      </div>
    </div>
  );
};

export default BioStep;
