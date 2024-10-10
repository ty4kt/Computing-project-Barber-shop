import React from "react";

const Calendar = ({ month, year, appointments = [] }) => {
  const getDaysArray = (year, month) => {
    // month in JavaScript's Date is 0-indexed (0 = January, 11 = December)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return daysArray;
  };

  const daysArray = getDaysArray(year, month);

  return (
    <div className="bg-[#1F1F1F] p-3 rounded-lg">
      <div className="text-white text-xl mb-4">{`${month} ${year}`}</div>
      <div className="grid grid-cols-10 gap-2">
        {daysArray.map((day, index) => (
          <div
            key={index}
            className={`p-2 w-10 text-center rounded-lg text-white ${
              appointments.includes(day) ? "bg-[#497CFF]" : "bg-[#161616]"
            } hover:bg-[#497CFF] cursor-pointer relative group`}
          >
            <div className="text-sm">{day}</div>
            {/* Hover element */}
            {appointments.includes(day) && (
              <div className="opacity-0 group-hover:opacity-100 absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-36 bg-white text-black rounded-md shadow-lg p-2 transition-opacity duration-300 ease-in-out">
                {/* Placeholder for appointment details */}
                <div className="text-xs">
                  {`Appointments on ${day}`}
                  {/* Map over appointments and display details here */}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
