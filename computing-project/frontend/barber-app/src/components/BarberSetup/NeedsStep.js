import React from "react";
import Button from "../Button";
import Logo from "./../Logo";
import { barberAccountSetup } from "../../utils/account";

const NeedsStep = ({ needs, setNeeds, nextStep }) => {
  const allNeeds = [
    "Beard Grooming",
    "Braiding",
    "Hair Recovery",
    "Dyeing",
    "Styling",
    "Detox",
    "Scalp Treatment",
    "Extensions",
    "Keratin Treatments",
    "Hair Straightening",
    "Curl Enhancing",
    "Thermal Reconditioning",
    "Hair Thickening",
    "Moisturizing Treatments",
    "Anti-Frizz Treatments",
    "Split End Repair",
    "Hair Glossing",
    "Deep Conditioning",
    "Hair Spa",
    "Aromatherapy for Hair",
    "Organic Hair Care",
    "Vegan Hair Treatments",
    "Sun Protection for Hair",
    "Color Correction",
    "Hair Analysis",
    "Custom Hair Care Regimens",
    "Nutritional Consultation for Hair Health",
    "Mustache Trimming",
    "Shaving",
    "Line Ups",
    "Fades",
    "Texturizing",
    "Beard Dyeing",
    "Beard Shaping",
    "Facial Hair Styling",
    "Head Shaves",
    "Eyebrow Trimming",
    "Nose and Ear Hair Trimming",
    "Scalp Massages",
    "Hot Towel Services",
    "Men’s Hair Consultation",
    "Grooming Packages",
  ];

  const toggleNeed = (need) => {
    if (needs.includes(need)) {
      setNeeds(needs.filter((n) => n !== need));
    } else {
      setNeeds([...needs, need]);
    }
  };

  const continueNextStep = async () => {
    if (needs.length === 0) {
      alert("Please select at least one need");
    }

    try {
      let response = await barberAccountSetup({ needs }, "needsStep");
      console.log(response);

      nextStep();
    } catch (error) {
      console.error("Error sending off:", error);
      alert("Error sending off");
    }
  };

  return (
    <div className="bg-black text-white space-y-4 p-4 sm:p-6 lg:p-8">
      <Logo />
      <h2 className="text-xl font-bold mb-3">Select the needs you offer</h2>
      <p className="mb-5">
        We advise all barbers to fill in as much as possible as this will help
        your chances of finding more customers.
      </p>
      <div className="h-[300px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 mb-5">
          {allNeeds.map((need) => (
            <button
              key={need}
              onClick={() => toggleNeed(need)}
              className={`${
                needs.includes(need)
                  ? "bg-barber-blue text-white"
                  : "bg-[#0D0D0D] text-white"
              } py-2 px-4 rounded-lg font-semibold transition`}
            >
              {need}
            </button>
          ))}
        </div>
      </div>

      <Button
        bg="bg-barber-blue hover:bg-blue-700"
        modifyClass={`w-full py-3 rounded-lg font-bold transition`}
        text={`Continue`}
        onClick={continueNextStep}
      />
    </div>
  );
};

export default NeedsStep;
