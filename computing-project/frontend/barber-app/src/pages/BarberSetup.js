import React, { useState, useEffect } from "react";
import BioStep from "../components/BarberSetup/BioStep";
import NeedsStep from "../components/BarberSetup/NeedsStep";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { accountSetupCheck } from "../utils/account";
import Success from "../components/AccountSetup/Success";
import { useUser } from "../contexts/UserContext";
import ProfilePicture from "../components/BarberSetup/ProfilePicture";
import BottomBar from "../components/BottomBar";
import PortfolioUploader from "../components/BarberSetup/PortfolioUploader";

const BarberSetup = () => {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState("");
  const [needs, setNeeds] = useState([]);

  const nextStep = () => setStep((prevStep) => prevStep + 1);

  return (
    <Layout backgroundColor={`bg-[#020202]`} centerContent={true}>
      <div>
        {step === 1 && (
          <BioStep bio={bio} setBio={setBio} nextStep={nextStep} />
        )}
        {step === 2 && (
          <NeedsStep needs={needs} setNeeds={setNeeds} nextStep={nextStep} />
        )}
        {step === 3 && <ProfilePicture nextStep={nextStep} />}
        {step === 4 && <PortfolioUploader nextStep={nextStep} />}
        {step === 5 && <Success />}
        {/* Continue this pattern for additional steps */}
      </div>
      <BottomBar/>
    </Layout>
  );
};

export default BarberSetup;
