"use client";
import Loading from "@/app/loading";
import Link from "next/link";
import { useEffect, useState } from "react";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const res = await fetch("/api/blogs", {
        next: {
          revalidate: 60,
        },
      });
      const data = await res.json();
      setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="flex items-center min-h-[80vh] bg-white flex-col mx-auto px-5 py-10 md:py-20">
      {loading ? (
        <Loading />
      ) : (
        <div className="grid w-full md:w-4/5 grid-cols-1 lg:grid-cols-2 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Link key={blog._id} href={`/blogs/${blog._id}`}>
                <div className="p-5 rounded drop-shadow-md hover:drop-shadow-lg transition duration-300 bg-gray-50 cursor-pointer">
                  <h2 className="text-2xl lg:text-3xl my-2 text-[#4e8d99] font-semibold">
                    {blog.title}
                  </h2>
                  <p className="text-gray-500 mt-2 text-lg text-justify">
                    {blog.content}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center">No blogs found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
