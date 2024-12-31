import Header from "@/components/Header";
import React from "react";

const PublicUserLayout = ({ children }) => {
  return (
    <div className="h-full w-full flex flex-col bg-gray-100 relative overflow-auto hide-scrollbar">
      <Header />
      <main className="h-full flex-1">{children}</main>
    </div>
  );
};

export default PublicUserLayout;
