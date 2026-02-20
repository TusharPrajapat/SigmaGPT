import React, { useState, useContext, useEffect, useRef } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { AuthContext } from "./auth/AuthContext";
import { ScaleLoader } from "react-spinners";
const API_BASE = import.meta.env.VITE_API_URL;

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
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [showShadow, setShowShadow] = useState(false);

  const chatWindowRef = useRef(null);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    // setIsOpenOptions(false);

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
    setIsOpenOptions(false);
    setIsOpenMenu(false);

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

  const handleOptionsClick = () => {
    setIsOpenOptions(!isOpenOptions);
    setIsOpenMenu(false);
  };

  const handleProfileClick = () => {
    setIsOpenMenu(!isOpenMenu);
    setIsOpenOptions(false);
  };

  const handleScroll = () => {
    if (!chatWindowRef.current) {
      return;
    }
    setShowShadow(chatWindowRef.current.scrollTop > 130);
  };

  return (
    <div className="chatWindow" ref={chatWindowRef} onScroll={handleScroll}>
      <div className={showShadow ? "navbar shadow" : "navbar"}>
        <div className="optionsDiv" onClick={handleOptionsClick}>
          <span style={{ fontWeight: "600" }}>
            SigmaGPT &nbsp;<i className="fa-solid fa-angle-down"></i>
          </span>
        </div>
        <div className="menu" onClick={handleProfileClick}>
          <span className="">
            <i className="fa-solid fa-ellipsis"></i>
          </span>
        </div>
      </div>
      {isOpenOptions && (
        <div className="dropDownOptions">
          <div className="dropDownOption1">
            <div style={{ margin: "0 5px 0 3px" }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div style={{ margin: "0 18px 0 3px" }}>
              <h5 style={{ fontSize: "14px", margin: "1px 0 1px 0" }}>
                ChatGPT Plus
              </h5>
              <p
                style={{
                  fontSize: "12px",
                  margin: "1px 0 1px 0",
                  fontWeight: "550",
                  color: "#989797",
                }}
              >
                Our smartest model & more
              </p>
            </div>
            <div className="upgradeDiv">Upgrade</div>
          </div>
          <div className="dropDownOption2">
            <div>
              <h5 style={{ fontSize: "14px", margin: "1px 0 1px 0" }}>
                ChatGPT 5.2
              </h5>
              <p
                style={{
                  fontSize: "12px",
                  margin: "1px 0 1px 0",
                  color: "#989797",
                  fontWeight: "550",
                }}
              >
                Flagship model
              </p>
            </div>
            <div>
              <i className="fa-solid fa-check"></i>
            </div>
          </div>
        </div>
      )}
      {isOpenMenu && (
        <div className="dropDownMenu">
          <div className="dropDownMenuItem">
            <i class="fa-solid fa-users"></i>&nbsp;&nbsp;Start a group chat
          </div>
          <div className="dropDownMenuItem">
            <i class="fa-solid fa-thumbtack"></i>
            &nbsp;&nbsp;Pin chat
          </div>
          <div className="dropDownMenuItem">
            <i class="fa-solid fa-box-archive"></i>
            &nbsp;&nbsp;Archive
          </div>
          <div className="dropDownMenuItem">
            <i class="fa-solid fa-flag"></i>
            &nbsp;&nbsp;Report
          </div>
          <div className="dropDownMenuItem" style={{ color: "red" }}>
            <i class="fa-solid fa-trash" style={{ color: "red" }}></i>
            &nbsp;&nbsp;Delete
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
