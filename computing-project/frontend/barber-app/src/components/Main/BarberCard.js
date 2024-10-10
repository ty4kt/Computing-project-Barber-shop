import React from "react";
import Logo from "../Logo";
import Bar from "./Bar";

const BarberCard = ({ barber, onLike, onSkip, onShowProfile }) => {
  const defaultBgImage = "/path/to/default/image.jpg";

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <div
        className="absolute inset-0 bg-black opacity-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${barber.image || defaultBgImage})` }}
      />
      <div className="relative z-10 p-6">
        <div className="flex flex-row items-center justify-center h-12 space-x-4">
          <Bar />
        </div>
        <img src="images/logo.png" alt="Barber Logo" className="w-24 mx-auto" />
      </div>

      <div className="relative z-10 p-6 mb-16">
        <h1 className="text-4xl text-white font-bold">{barber.full_name}</h1>
        <p className="text-white">{barber.location.postcode.split(" ")[0]}</p>
        <div className="flex flex-wrap mt-4">
          {barber.services.map((service) => (
            <span
              key={service}
              className="bg-[#292929]/50 text-white py-1 px-3 rounded-lg text-sm font-semibold m-1"
            >
              {service}
            </span>
          ))}
        </div>
        <p className="text-white max-w-md mt-4 text-left">{barber.bio}</p>
        {/* Buttons */}
        <div className="flex items-center justify-center -space-x-4 mt-6">
          <button className="bg-[#2C2C2C] hover:bg-[#131313] transition w-64 py-4 rounded-2xl text-white" onClick={() => onSkip(barber)}>
            <i class="fa-solid fa-x"></i>
          </button>
          <button className="bg-[#FFFFFF] w-16 h-16 p-4 rounded-full z-5 relative" onClick={() => onShowProfile()}>
            <i class="fa-solid fa-chevron-down"></i>
          </button>
          <button className="bg-[#497CFF] hover:bg-[#499eff] transition w-64 py-4 rounded-2xl text-white" onClick={() => onLike(barber)}>
            <i class="fa-solid fa-thumbs-up"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarberCard;
