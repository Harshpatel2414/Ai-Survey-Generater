import React from "react";

const StatCard = ({ icon, title, value }) => {
  return (
    <div
      className={`flex items-center p-6 rounded-lg drop-shadow-md bg-white `}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-inner mr-4`}
      >
        <span className="text-2xl text-[#4e8d99]">{icon}</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xl text-[#4e8d99] font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
