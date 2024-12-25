"use client";
import Loading from "@/app/loading";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaPaperPlane, FaSearch, FaSync } from "react-icons/fa";

function SupportPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    // Fetch all support messages
    async function fetchMessages() {
      setLoading(true);
      const response = await fetch("/api/support");
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    }

    fetchMessages();
  }, []);

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

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

  return (
    <div className="bg-white w-full">
      <div className="flex flex-col w-full md:flex-row md:items-center gap-4 justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-[#4e8d99]">
            Support Messages
          </h1>
          <button className="flex items-center gap-2 px-3 py-1 rounded-md border text-[#4e8d99] hover:bg-gray-50">
            <FaSync className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="border bg-white rounded-lg h-10 flex items-center gap-2 p-2 drop-shadow-sm">
          <FaSearch className="w-6 h-6 text-gray-300" />
          <input
            type="text"
            placeholder="Search user by email"
            className="w-full md:w-80 outline-none bg-transparent"
          />
        </div>
      </div>
      <div className="p-5">
        {loading ? (
          <Loading />
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.email}
                className="p-5 border-b bg-[#edfaf3] rounded-md max-w-sm"
              >
                <p>
                  Name :{" "}
                  <span className="font-semibold text-[#4e8d99] capitalize">
                    {message.name}
                  </span>
                </p>
                <p>
                  Email : <span className="text-gray-600">{message.email}</span>
                </p>
                <p>
                  Message: <span>{message.message}</span>
                </p>
                <div className="flex flex-col  items-end gap-2 mt-4">
                  <textarea
                    value={reply}
                    rows={3}
                    onChange={handleReplyChange}
                    placeholder="Enter your reply"
                    className="w-full flex-1 p-2 border rounded-md resize-none outline-none"
                  />
                  <button
                    onClick={()=>handleSendReply(message.email)}
                    className="text-white w-fit bg-[#4e8d99] flex items-center gap-2 px-3 py-2 rounded-md"
                  >
                    <FaPaperPlane className="w-5 h-5 text-white" />
                    <span className="text-white">send reply</span>
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
