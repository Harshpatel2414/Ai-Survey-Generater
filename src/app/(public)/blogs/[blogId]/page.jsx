"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Loading from "@/app/loading";

const BlogDetails = ({ params }) => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(false);
  const blogId = React.use(params).blogId;

  useEffect(() => {
    const getBlogDetails = async () => {
      setLoading(true);
      const res = await fetch(`/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      });
      const data = await res.json();
      setBlog(data);
      setLoading(false);
    };
    getBlogDetails();
  }, [blogId]);

  return (
    <div className="h-full min-h-[80vh] flex flex-col items-center w-full bg-white mx-auto p-4 mb-20">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="w-full md:w-2/3 lg:w-2/4 pt-10">
            <Link
              href={"/blogs"}
              className="flex gap-2 items-center underline mb-4"
            >
              <FaArrowLeft /> Back
            </Link>
            <h1 className="text-2xl md:text-4xl text-[#4e8d99] font-semibold mb-5 pb-5 border-b-2">
              {blog.title}
            </h1>
            <p className="text-gray-700 text-lg mb-4">{blog.content}</p>
          </div>
          <div className="w-full max-h-[640px] bg-gray-100 md:w-2/3 lg:w-2/4 my-10 object-center">
            {blog.image && <Image
              width={400}
              height={300}
              className=" w-full h-full object-contain"
              src={blog?.image}
              alt={blog?.title}
            />}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogDetails;
