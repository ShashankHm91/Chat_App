import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { IoArrowBack } from "react-icons/io5";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const VITE_LOCALHOST_KEY = import.meta.env.VITE_LOCALHOST_KEY; // Use Vite's environment variables
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket, back }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const go_back = () => {
    back(); // Call the back function passed as a prop
  };




  const messageData = async () => {
    const data = await JSON.parse(
      localStorage.getItem(VITE_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }


  useEffect(() => {
    messageData()
  }, [currentChat]);

  const getCurrentChat = async () => {
    if (currentChat) {
      await JSON.parse(
        localStorage.getItem(VITE_LOCALHOST_KEY)
      )._id;
    }
  };
  useEffect(() => {
    getCurrentChat();
  }, [currentChat]);


  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem(VITE_LOCALHOST_KEY));

    // Emit message to socket immediately
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });

    // Update UI immediately
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);

    // Send message to backend (this happens in parallel to UI update)
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });
  };

  // Ensure that incoming messages are listened for as soon as the socket is available
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket.current]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="go-back" onClick={go_back}>
            <IoArrowBack size={24} color="white" /> {/* React Icon */}
          </div>
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      .go-back {
        color: #fff;
        cursor: pointer;
        font-size: 1.5rem; 
        margin-right: 1rem;
        display: flex;
        align-items: center;
      }
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 1.2rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 100%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #073708; /* Sender's message (green) */
        color: #fff;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #03233c; /* Receiver's message (blue) */
        color: #fff;
      }
    }
  }
`;

