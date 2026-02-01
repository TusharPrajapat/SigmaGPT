import React, { useContext, useState, useEffect } from "react";
import "./Chat.css";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null); //loading prevChats
      return;
    }

    if (!prevChats?.length) {
      return;
    }

    const content = reply.split(" "); // spliting on the basis of spaces (individual word)

    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" ")); //this again joins words into String with delay of 40 mili sec
      idx++;
      if (idx >= content.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <div>
      {/* To start new chat */}
      {newChat && <h1>Start a New Chat!</h1>}
      <div className="chats">
        {/* Taking everything except the last one (AI reply) */}
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {/* When gpt is typing */}
        {prevChats.length > 0 && latestReply !== null && (
          <div className="gptDiv" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        )}

        {/* When gpt is not typing*/}
        {prevChats.length > 0 && latestReply === null && (
          <div className="gptDiv" key={"not-typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {/* last Ai Reply */}
              {prevChats[prevChats.length - 1].content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
