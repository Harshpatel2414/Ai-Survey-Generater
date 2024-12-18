"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [msgError, setMsgError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.message.length > 10) {
      setMsgError(false);
      setLoading(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(result.message || "Your message has been sent!");
          setFormData({ name: "", email: "", message: "" });
        } else {
          toast.error(
            result.message || "Something went wrong. Please try again."
          );
        }
      } catch (error) {
        toast.error(
          "Failed to send message. Please check your network connection."
        );
      } finally {
        setLoading(false);
      }
    } else {
      setMsgError(true);
    }
  };

  return (
    <>
      <Head>
        <title>Contact | AI Survey Generator</title>
        <meta
          name="description"
          content="Contact the AI Survey Generator team for any questions, feedback, or support. Fill out the form to get in touch with us."
        />
      </Head>
      <div className="flex flex-col items-center bg-white px-5  hide-scrollbar animate-fadeIn">
        <div className="max-w-4xl h-fit w-full lg:w-3/4 rounded-lg px-0  md:p-8 ">
          <Link
            href="/"
            className="top-4 right-4 absolute underline text-[#4e8d99]"
          >
            Back
          </Link>
          <h1 className="text-3xl font-bold text-[#4e8d99] mb-6 text-center">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700 text-center leading-relaxed mb-4">
            Thank you for using{" "}
            <span className="font-semibold text-[#4e8d99]">
              AI Survey Generator
            </span>
            . Whether you have a question about features, pricing, or anything
            else, our team is here to help. Fill out the form below, and we&apos;ll
            get back to you shortly.
          </p>
          <div className="max-w-lg w-full mx-auto bg-white p-5 shadow-md rounded-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  required
                  className="w-full pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99]"
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message"
                  required
                  className="w-full pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e8d99] resize-none"
                  rows="6"
                ></textarea>
                {msgError && (
                  <span className="text-red-500 text-sm">
                    Please provide more details in your message.
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 text-white rounded-md ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#4e8d99]"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
