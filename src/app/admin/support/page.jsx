"use client";
import Loading from "@/app/loading";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaPaperPlane, FaSearch, FaSync } from "react-icons/fa";

const getTimeAgo = (dateString) => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const difference = Math.abs(now - createdAt);
  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day ago`;
};

function SupportPage() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [searchTerm, setSearchTerm] = useState("");  

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const response = await fetch("/api/support");
    const data = await response.json();
    setMessages(data);
    setFilteredMessages(data);  
    setLoading(false);
  }

  const handleSendReply = async (selectedEmail) => {
    if (!reply) {
      toast.error("Please enter a reply message");
      return;
    }

    const response = await fetch("/api/support", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: selectedEmail, replyMessage: reply }),
    });

    const result = await response.json();
    if (response.ok) {
      toast.success(result.message);
      setReply("");
    } else {
      toast.error("Failed to send reply");
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue); 

    if (searchValue === "") {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter((message) =>
        message.email.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  };

  return (
    <div className="bg-white w-full h-full">
      <div className="flex flex-col w-full md:flex-row md:items-center gap-4 justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-[#4e8d99]">Support Messages</h1>
          <button className="flex items-center gap-2 px-3 py-1 rounded-md border text-[#4e8d99] hover:bg-gray-50">
            <FaSync className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="border bg-white rounded-lg h-10 flex items-center gap-2 p-2 drop-shadow-sm">
          <FaSearch className="w-6 h-6 text-gray-300" />
          <input
            type="text"
            value={searchTerm}  
            onChange={handleSearch}
            placeholder="Search user by email"
            className="w-full md:w-80 outline-none bg-transparent"
          />
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4 min-h-[80dvh]">
        {loading ? (
          <Loading />
        ) : (
          <>
            {filteredMessages.map((message) => (
              <div
                key={message.email}
                className="p-5 flex flex-col relative border-b bg-white hover:drop-shadow-lg drop-shadow-md rounded-md w-full"
              >
                <div className=" flex-1">
                  <div className="border-b pb-2">
                    <p className="font-semibold text-lg text-[#4e8d99] capitalize">
                      {message.name}
                    </p>
                    <p className="text-gray-600">{message.email}</p>
                  </div>
                  <span className="text-sm absolute top-4 right-4 text-gray-500">
                    {getTimeAgo(message.createdAt)}
                  </span>
                </div>
                <p className="text-gray-600 mt-4">
                  Message: <span>{message.message}</span>
                </p>
                <div className="flex flex-col md:flex-row items-end gap-4 mt-4">
                  <textarea
                    value={reply}
                    rows={2}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Enter your reply"
                    className="w-full flex-1 p-2 border rounded-md  outline-none resize-none"
                  />
                  <button
                    onClick={() => handleSendReply(message.email)}
                    className="text-white w-fit h-fit bg-[#4e8d99] flex items-center gap-3 px-4 py-2 rounded-md"
                  >
                    <span className="text-white">Send</span>
                    <FaPaperPlane className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default SupportPage;
