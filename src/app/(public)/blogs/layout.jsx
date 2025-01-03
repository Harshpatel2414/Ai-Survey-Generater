import Footer from "@/components/Footer";
import React from "react";

const BlogLayout = ({ children }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[#4e8d99] text-white p-4 py-10">
        <h1 className="text-4xl font-bold text-center py-10">Blogs</h1>
      </div>
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default BlogLayout;
