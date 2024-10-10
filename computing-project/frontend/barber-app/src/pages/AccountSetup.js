import React, { useState, useEffect } from "react";
import PostcodeStep from "../components/AccountSetup/PostcodeStep";
import NeedsStep from "../components/AccountSetup/NeedsStep";
import Layout from "../components/Layout";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { accountSetupCheck } from "../utils/account";
import Success from "../components/AccountSetup/Success";
import { useUser } from "../contexts/UserContext";

const AccountSetup = () => {
  
  const [step, setStep] = useState(1);
  const [postcode, setPostcode] = useState("");
  const [needs, setNeeds] = useState([]);
  

  const nextStep = () => setStep((prevStep) => prevStep + 1);

  return (
    <Layout backgroundColor={`bg-[#020202]`} centerContent={true}>
      <div>
        {step === 1 && (
          <PostcodeStep
            postcode={postcode}
            setPostcode={setPostcode}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <NeedsStep needs={needs} setNeeds={setNeeds} nextStep={nextStep} />
        )}
        {step === 3 && (
          <Success />
        )}
        {/* Continue this pattern for additional steps */}
      </div>
    </Layout>
  );
};

export default AccountSetup;
