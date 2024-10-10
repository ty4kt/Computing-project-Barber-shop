import React from "react";

const Input = ({ label, type = "text", bg = "bg-[#0D0D0D]", placeholder, value, onChange, modifyClass }) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        name={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`appearance-none rounded-xl w-full p-3 text-white leading-tight ${bg} mx-auto ${modifyClass}`}
      />
    </div>
  );
};

export default Input;