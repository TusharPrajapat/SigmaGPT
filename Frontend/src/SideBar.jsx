import React, { useState, useEffect, useContext } from "react";
import "./SideBar.css";
import { MyContext } from "./MyContext.jsx";
import { AuthContext } from "./auth/AuthContext.jsx";
import { logout } from "./services/authService";
import { useNavigate } from "react-router-dom";
import { v1 as uuidv1 } from "uuid";
const API_BASE = import.meta.env.VITE_API_URL;

export default function SideBar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();

  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setcurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: "include",
      });

      const res = await response.json();
      if (res.name) {
        setUsername(res.name);
      }
    } catch (err) {
      console.log("Error -> ", err);
    }
  };

  const getAllThreads = async () => {
    setIsOpenProfile(false);
    try {
      const response = await fetch(`${API_BASE}/api/thread`, {
        credentials: "include",
      });
      const res = await response.json();
      if (!Array.isArray(res)) {
        setAllThreads([]);
        return;
      }
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      // console.log(res);
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    setIsOpenProfile(false);
    getAllThreads();
  }, [currThreadId, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    getProfile();
  }, [isAuthenticated]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setcurrThreadId(uuidv1());
    setPrevChats([]);
    setIsOpenProfile(false);
  };

  const changeThread = async (newthreadId) => {
    setcurrThreadId(newthreadId);
    setIsOpenProfile(false);

    try {
      const response = await fetch(`${API_BASE}/api/thread/${newthreadId}`, {
        credentials: "include",
      });
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch {}
  };

  const deleteThread = async (threadId) => {
    setIsOpenProfile(false);
    try {
      const response = await fetch(`${API_BASE}/api/thread/${threadId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const res = await response.json();
      console.log(res);

      //updated threads re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleProfileClick = () => {
    setIsOpenProfile(!isOpenProfile);
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
    <section className="sidebar">
      {/* new chat button */}
      <div className="headerDiv">
        <div className="logoDiv">
          <img src="/logo.png" alt="gpt logo" className="logo" />
        </div>

        <div className="sidePanelDiv">
          <i class="fa-solid fa-angles-left"></i>
        </div>
      </div>

      <div className="overflowDiv">
        {/* New options */}
        <div className="newOptions">
          <div className="newOptionsItems" onClick={createNewChat}>
            <i class="fa-regular fa-pen-to-square"></i>&nbsp;&nbsp;New chat
          </div>
          <div className="newOptionsItems">
            <i class="fa-solid fa-magnifying-glass"></i>&nbsp;&nbsp;Search chat
          </div>
          <div className="newOptionsItems">
            <i class="fa-regular fa-images"></i>&nbsp;&nbsp;Images
          </div>
          <div className="newOptionsItems">
            <i class="fa-brands fa-app-store"></i>&nbsp;&nbsp;Apps
          </div>
          <div className="newOptionsItems">
            <i class="fa-solid fa-terminal"></i>&nbsp;&nbsp;Codex
          </div>
          <div className="newOptionsItems">
            <i class="fa-brands fa-codepen"></i>&nbsp;&nbsp;GPTs
          </div>
          <div className="newOptionsItems">
            <i class="fa-regular fa-folder-open"></i>&nbsp;&nbsp;Projects
          </div>
        </div>
        <p style={{ fontSize: "14px", margin: "0px 22px", color: "#aaaaaa" }}>
          Your chats
        </p>
        {/* history */}
        <ul className="history" style={{ margin: "0" }}>
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : " "}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash-can"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>
      </div>
      {/* sign */}
      <div className="sign" onClick={handleProfileClick}>
        <div className="profile">
          <div className="userIconDiv">
            <span className="userIcon">TP</span>
          </div>
          <div className="userInfo">
            <h5 style={{ fontSize: "13px", margin: "5px 0 1px 0" }}>
              {username}
            </h5>
            <p
              style={{
                fontSize: "12px",
                margin: "2px 0 1px 0",
                fontWeight: "500",
                color: "#989797",
              }}
            >
              Go
            </p>
          </div>
        </div>
      </div>
      {isOpenProfile && (
        <div className="dropDownProfile">
          <div className="dropDownProfileItem-profile">
            <div className="userIconDiv">
              <span className="userIcon">TP</span>
            </div>
            <div className="userInfo">
              <h5 style={{ fontSize: "13px", margin: "5px 0 1px 0" }}>
                {username}
              </h5>
              <p
                style={{
                  fontSize: "12px",
                  margin: "2px 0 1px 0",
                  fontWeight: "500",
                  color: "#989797",
                }}
              >
                Go
              </p>
            </div>
          </div>
          <hr style={{ margin: "5px 0" }} />
          <div className="dropDownProfileItem">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            &nbsp;&nbsp;UpgradePlan
          </div>
          <div className="dropDownProfileItem">
            <i className="fa-solid fa-user-gear"></i>
            &nbsp;&nbsp;Personalization
          </div>
          <div className="dropDownProfileItem">
            <i class="fa-solid fa-gear"></i>
            &nbsp;&nbsp;Setting
          </div>
          <hr style={{ margin: "5px 0" }} />
          <div className="dropDownProfileItem-help">
            <div>
              <i class="fa-solid fa-life-ring"></i>
              &nbsp;&nbsp;Help
            </div>
            <div>
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </div>
          <div className="dropDownProfileItem" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            &nbsp;&nbsp;Logout
          </div>
        </div>
      )}
    </section>
  );
}
