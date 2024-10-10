import React from "react";

const BarberSchedule = ({ barbers, onBarberSelect }) => {

  
  return (
    <div className="py-8">
      <div className="text-white text-lg mb-2">BARBERS</div>
      <div className="flex overflow-x-auto gap-4">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="text-center"
            onClick={() => onBarberSelect(barber._id)}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto">
              <img
                src={barber.profile.profile_picture}
                alt={barber.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white mt-2">{barber.full_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarberSchedule;
