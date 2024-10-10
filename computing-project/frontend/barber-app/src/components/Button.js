import React from "react";

const Button = ({ text, type = "button", bg = "bg-[#0D0D0D]", onClick, modifyClass }) => {
    return (
        <button
        type={type}
        onClick={onClick}
        className={`appearance-none rounded-xl p-3 text-white leading-tight ${bg} mx-auto ${modifyClass}`}
        >
        {text}
        </button>
    );
};

export default Button;