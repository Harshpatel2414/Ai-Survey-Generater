import React from "react";

const StatCard = ({ icon, title, value }) => {
  return (
    <div
      className={`flex items-center p-6 rounded-lg drop-shadow-md bg-white hover:shadow-lg transition-shadow`}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-inner mr-4`}
      >
        <span className="text-2xl text-[#4e8d99]">{icon}</span>
      </div>
      <div>
        <p className="text-xl text-[#4e8d99] font-bold">{value}</p>
        <h3 className="text-base font-medium">{title}</h3>
      </div>
    </div>
  );
};

export default StatCard;
