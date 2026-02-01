import React, { useState, useContext, useEffect, useRef } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { AuthContext } from "./auth/AuthContext";
import { logout } from "./services/authService";
import { useNavigate } from "react-router-dom";
import { PuffLoader, ScaleLoader } from "react-spinners";
const API_BASE = import.meta.env.VITE_API_URL;

export default function ChatWindow() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setcurrThreadId,
    prevChats,
    setNewChat,
    setPrevChats,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showShadow, setShowShadow] = useState(false);

  const chatWindowRef = useRef(null);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    console.log("message ", prompt, " threadId ", currThreadId);
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(`${API_BASE}/api/chat`, options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //Append newChat to prevChat

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = () => {
    if (!chatWindowRef.current) {
      return;
    }
    setShowShadow(chatWindowRef.current.scrollTop > 130);
  };

  const handleLogout = async () => {
    try {
      await logout(); // clears cookie
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.log("Logout failed", err);
    }
  };

  return (
    <div className="chatWindow" ref={chatWindowRef} onScroll={handleScroll}>
      <div className={showShadow ? "navbar shadow" : "navbar"}>
        <span>
          SigmaGPT &nbsp;<i className="fa-solid fa-angle-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i>&nbsp;&nbsp;Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            &nbsp;&nbsp;UpgradePlan
          </div>
          <div className="dropDownItem" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;Logout
          </div>
        </div>
      )}
      <div className="chatBody">
        <Chat />
      </div>

      {loading && (
        <div className="loaderRow">
          <ScaleLoader color="#fff" />
        </div>
      )}

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          SigmaGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}
