import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { rsetPasswordRoute } from "../utils/APIRoutes";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const VITE_LOCALHOST_KEY = import.meta.env.VITE_LOCALHOST_KEY;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { email, newPassword, confirmPassword } = values;
    if (email === "" || newPassword === "" || confirmPassword === "") {
      toast.error("All fields are required.", toastOptions);
      return false;
    }

    if (newPassword.length < 8) {
      toast.error("Password should be equal to or greater than 8 characters.", toastOptions);
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password and confirm password should be the same.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { email, newPassword, confirmPassword } = values;
      try {
        const { data } = await axios.post(rsetPasswordRoute, {
          email,
          newPassword,
          confirmPassword,
        });
        console.log(data);
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during API call:", error); // Debugging
        toast.error("Something went wrong, please try again later.", toastOptions);
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Chatty</h1>
          </div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <PasswordContainer>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              name="newPassword"
              onChange={(e) => handleChange(e)}
            />
            <VisibilityToggle onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VscEye /> : <VscEyeClosed />}
            </VisibilityToggle>
          </PasswordContainer>
          <PasswordContainer>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={(e) => handleChange(e)}
            />
            <VisibilityToggle onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <VscEye /> : <VscEyeClosed />}
            </VisibilityToggle>
          </PasswordContainer>
          <button type="submit">Submit</button>
          <span>
            Don't have an account? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #4e0eff;
    }
  }

  span {
    color: white;
    text-transform: uppercase;

    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

const PasswordContainer = styled.div`
  position: relative;

  input {
    padding-right: 2rem; 
  }
`;

const VisibilityToggle = styled.div`
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
  color: #fff;
`;
