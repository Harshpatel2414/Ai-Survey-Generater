"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoIosAttach } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import { PiNotePencilBold } from "react-icons/pi";
import Cookies from "js-cookie";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const csrfToken = Cookies.get("csrf-token");

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/blog", {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
      });
      const data = await res.json();
      setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const method = editingBlog ? "PUT" : "POST";

    const bodyData = {
      title: formData.title,
      content: formData.content,
      image: formData.image,
    };
    if (editingBlog) {
      bodyData._id = editingBlog._id;
    }

    const res = await fetch("/api/admin/blog", {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(bodyData),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success(data.message);
      setEditingBlog(null);
      setFormData({ title: "", content: "", image: null });
      setPreviewImage(null);
      setIsModalVisible(false);
      setBlogs((prev) =>
        editingBlog
          ? prev.map((b) => (b._id === editingBlog._id ? bodyData : b))
          : [{ _id: data._id, ...formData }, ...prev]
      );
    }
    setUpdating(false);
  };

  const handleDelete = async (id) => {
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ id }),
    });
    setBlogs((prev) => prev.filter((blog) => blog._id !== id));
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({ title: blog.title, content: blog.content, image: null });
    setPreviewImage(blog.image || null);
    setIsModalVisible(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleModal = (isVisible) => {
    setIsModalVisible(isVisible);
    if (isVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  };

  return (
    <div className="relative mx-auto flex flex-col w-full bg-white pb-20 h-full">
      <div className="flex items-center justify-between bg-white px-5 py-4 border-b md:drop-shadow-sm z-20">
        <h1 className="text-2xl font-semibold text-center text-[#4e8d99]">
          Blogs Management
        </h1>
        <button
          onClick={() => toggleModal(true)}
          className="bg-[#4e8d99] flex items-center text-white py-2 pl-2 text-sm pr-4 rounded"
        >
          <FaPlus className="mr-2" />
          Add Blog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 md:p-10 bg-white">
        {loading ? (
          <div className="col-span-3 flex items-center justify-center h-[60vh]">
            <Loading />
          </div>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="h-fit p-4 rounded-lg drop-shadow-md hover:drop-shadow-lg bg-white"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt="Blog"
                  className="w-full h-48 object-cover bg-gray-200 mb-4 rounded-md"
                />
              )}
              <h2 className="text-xl font-semibold mb-2 truncate">{blog.title}</h2>
              <p className="text-gray-700 mb-4 truncate">{blog.content}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(blog)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md flex items-center gap-2"
                >
                  <PiNotePencilBold className="text-lg" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500 text-white py-1 px-4 rounded-md flex items-center gap-2"
                >
                  <FaTrash size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center">No blogs found</div>
        )}
      </div>

      {isModalVisible && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-30 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingBlog ? "Edit Blog" : "Add Blog"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Blog Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="border p-3 rounded-lg mb-4 w-full"
              />
              <textarea
                placeholder="Blog Content"
                rows={4}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                className="border p-3 rounded-lg mb-4 w-full h-32 resize-none"
              />
              <div>
                <label
                  htmlFor="image"
                  className="flex items-center underline gap-2 mb-4 cursor-pointer rounded-lg w-fit tracking-wide text-[#4e8d99]"
                >
                  <IoIosAttach className="text-xl" />
                  {previewImage ? "Change Image" : "Select Image"}
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-4 hidden"
                />
              </div>
              {previewImage && (
                <div className="relative p-2 w-fit bg-gray-100 mb-5">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-32 object-cover rounded-bl-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, image: null });
                      setPreviewImage(null);
                    }}
                    className="absolute top-2 right-2 bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded-bl-md"
                  >
                    <AiOutlineClose className="text-lg" />
                  </button>
                </div>
              )}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    toggleModal(false);
                    setFormData({ title: "", content: "", image: null });
                    setEditingBlog(null);
                    setPreviewImage(null);
                  }}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  {updating
                    ? "Loading..."
                    : editingBlog
                    ? "Update Blog"
                    : "Add Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
