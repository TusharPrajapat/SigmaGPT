import React, { useEffect, useContext } from "react";
import "./SideBar.css";
import { MyContext } from "./MyContext.jsx";
import { AuthContext } from "./auth/AuthContext.jsx";
import { v1 as uuidv1 } from "uuid";
const API_BASE = import.meta.env.VITE_API_URL;

export default function SideBar() {
  const { isAuthenticated } = useContext(AuthContext);

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

  const getAllThreads = async () => {
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
    if (!isAuthenticated) return;
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setcurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newthreadId) => {
    setcurrThreadId(newthreadId);

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

  return (
    <section className="sidebar">
      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src="/blacklogo.png" alt="gpt logo" className="logo" />
        <span>
          {" "}
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* history */}
      <ul className="history">
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

      {/* sign */}
      <div className="sign">
        <p>By Tushar &hearts;</p>
      </div>
    </section>
  );
}
