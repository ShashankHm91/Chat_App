import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Logout from "../components/Logout";
const VITE_LOCALHOST_KEY = import.meta.env.VITE_LOCALHOST_KEY; // Use Vite's environment variables


export default function Chat() {

  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const userData = async () => {
    if (!localStorage.getItem(VITE_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(VITE_LOCALHOST_KEY)
        )
      );
    }
  }

  const avatarData = async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }

  useEffect(() => {
    userData()
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    avatarData()
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <LogoutContainer>
          <Logout />
        </LogoutContainer>
        {/* <Contacts contacts={contacts} changeChat={handleChatChange} /> */}
        {currentChat === undefined ? (
          <Contacts contacts={contacts} changeChat={handleChatChange} />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} back={() => setCurrentChat(undefined)} />
        )}

      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  position: relative;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    /* grid-template-columns: 25% 75%; */
    
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

const LogoutContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 4rem;

`;
