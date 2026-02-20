import { useState, useContext } from "react";
import "./App.css";
import SideBar from "./SideBar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { AuthContext } from "./auth/AuthContext";
import Login from "./auth/Login.jsx";
import { v1 as uuidv1 } from "uuid";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setcurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValue = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setcurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };

  //while checking auth
  // if (isAuthenticated === null) {
  //   return (
  //     <div className="container" style={{}}>
  //       <h1>Welcome To SigmaGPT</h1>
  //       <p>Please wait while this app is loading...</p>
  //     </div>
  //   );
  // }

  // not logged in
  if (!isAuthenticated) {
    return <Login />;
  }

  // logged in -> show chat
  return (
    <div className="app">
      <MyContext.Provider value={providerValue}>
        <SideBar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
