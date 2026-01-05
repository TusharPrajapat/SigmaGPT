import React, { useState, useContext, useEffect, useRef } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { PuffLoader, ScaleLoader } from "react-spinners";

export default function ChatWindow() {
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

  const chatBodyRef = useRef(null);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    console.log("message ", prompt, " threadId ", currThreadId);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
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
    if (!chatBodyRef.current) return;
    setShowShadow(chatBodyRef.current.scrollTop > 0);
  };

  return (
    <div className="chatWindow">
      <div className={`navbar ${showShadow ? "shadow" : ""}`}>
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
          <div className="dropDownItem">
            <i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;Logout
          </div>
        </div>
      )}
      <div className="chatBody" ref={chatBodyRef} onScroll={handleScroll}>
        <Chat />
        {loading && <ScaleLoader color="#fff" />}
      </div>

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
