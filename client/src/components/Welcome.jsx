import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
const VITE_LOCALHOST_KEY = import.meta.env.VITE_LOCALHOST_KEY; // Use Vite's environment variables


export default function Welcome() {

  const [userName, setUserName] = useState("");

  // const userNaeData = async () => {
  //   const data = JSON.parse(localStorage.getItem(VITE_LOCALHOST_KEY)).userName
  //   setUserName(data);
  // }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(VITE_LOCALHOST_KEY))?.username;
  setUserName(data);
  // userNaeData()
}, []);

return (
  <Container>
    <img src={Robot} alt="" />
    <h1>
      Welcome, <span>{userName}!</span>
    </h1>
    <h3>Please select a chat to Start messaging.</h3>
  </Container>
);
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
